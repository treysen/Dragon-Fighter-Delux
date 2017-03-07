"use strict";

var canvasElem;
var world;
// Self created audio for the game.
var ya = new Audio("ya.mp3");
var songLoop = new Audio("songLoop.mp3");
var vic = new Audio("vic.mp3");
var los = new Audio("los.mp3");
var draw = new Audio("draw.mp3");
var hit = new Audio("hit.mp3");
var skin = "viking.png";
var winCondMet = false;
window.onload = initAll;

function initAll()
{
    //Jacked this to make the loop actually loop.
    songLoop.addEventListener('ended', function(){
        this.currentTime = 0;
        this.play();
    }, false);
    songLoop.play(); // Starts game song.

    canvasElem = document.getElementById("game");
    world = boxbox.createWorld(canvasElem);

    if(localStorage.pageLoadCount >= 10){
        alert("Teenage Mutant Ninja Squirts has joined the fight!");
        skin = "ninja.png";
    }
    if(localStorage.pageLoadCount < 0){
        alert("It seems your score is too low to select a warrior. Have a bubba.");
        skin = "dur.png";
    }
    //Creates the warrior Pik!
    var Pik = world.createEntity({
        name: "Pik",
        shape: "circle",

        //Loads image from file and sets the size
        image: skin,
        imageStretchToFit: true,
        /////f///////////////
        radius: 1,
        density: 4,
        x: 2
    });

    // Totally just jacked this code from the demo.js and modified it for working on my own.
    // But it works.
    Pik.onKeydown(function(e) {

        // jump
        if (e.keyCode === 32) {
            ya.play();
            this.applyImpulse(120);
            return false;
        }

        // move left
        if (e.keyCode === 37) {
            this.setForce('movement', 150, 270);
            return false;
        }

        // move right
        if (e.keyCode === 39) {
            this.setForce('movement', 150, 90);
            return false;
        }

        //POWER ATTACK Right
        if(e.keyCode === 80){
            ya.play();
            this.applyImpulse(230, 90);
            return false;
        }
        // POWER ATTACK Left
        if(e.keyCode === 81){
            ya.play();
            this.applyImpulse(230, 270);
            return false;
        }
    });
    Pik.onKeyup(function(e) {

        if (this._destroyed) {
            return;
        }

        // clear movement force on arrow keyup
        if (e.keyCode === 37 || e.keyCode === 39) {
            this.clearForce('movement');
            return false;
        }

    });

    // Sets the ground.
    world.createEntity({
        name: "ground",
        shape: "square",
        type: "static",
        color: "gray",
        width: 20,
        height: 0.5,
        y: 12
    });
    //platform 1
    world.createEntity({
        name: "platform1",
        shape: "square",
        type: "static",
        color: "gray",
        width: 20,
        height: 0.5,
        y: 19,
        x: 25
    });
    //ceiling 1 to stop player from flying away
    world.createEntity({
        name: "ceiling",
        shape: "square",
        type: "static",
        color: "gray",
        width: 600,
        height: 0.5,
        y: -3,
        x: -5
    });
    //WALL
    world.createEntity({
        name: "wall",
        shape: "square",
        type: "static",
        color: "gray",
        width: 3,
        height: 5.5,
        y: 9,
        x: 2.5
    });
    // border
    world.createEntity({
        name: "wall2",
        shape: "square",
        type: "static",
        color: "gray",
        width: 1,
        height: 30,
        y: 4,
        x: 33
    });

    // Just the platform stuff from class.
    var block = {
        name: "block",
        shape: "square",
        color: "brown",
        width: 0.5,
        height: 4,
        onImpact: function(entity, force){
            if(entity.name()==="Pik"){

                this.color("black");
            }
        }
    };

    // Dragon settings.
    var DRAGON = {
        name: "DRAGON",
        shape: "square",
        color: "blue",
        width: 6,
        height: 5,
        onImpact:function(entity, force){
            if(entity.name()==="Pik"){
                hit.play();
                this.color("black");
            }
        }
    };

    // Creates the platforms that Dragon is standing on.
    world.createEntity(block, { x: 13, image: "brick.png", imageStretchToFit: true, imageOffsetY: -1 } );

    world.createEntity(block, { x: 15, image: "brick.png", imageStretchToFit: true, imageOffsetY: -1 } );

    world.createEntity(block, { x: 17, image: "brick.png", imageStretchToFit: true, imageOffsetY: -1 } );

    world.createEntity(block, {
        x: 14,
        y: 1,
        image: "brick.png",
        imageStretchToFit: true,
        imageOffsetX: -0.8,
        imageOffsetY: -0.1,
        width: 7,
        height: 0.5
    });

    //Creates the dragon Hector.
    var Geof = world.createEntity(DRAGON, {
        name: "DRAGON",
        x: 15,
        y: -1.5,
        image: "dragon.png",
        imageStretchToFit: true,
        imageOffsetX: -2,
        imageOffsetY: -1
    });


    //Simply counts the times the page was visited. Used to set the score.
    if (!localStorage.pageLoadCount)
        localStorage.pageLoadCount = 0;
    localStorage.pageLoadCount = parseInt(localStorage.pageLoadCount);
    document.getElementById('spanScore').textContent = localStorage.pageLoadCount;


    // Timer setting stuff.
    var WinTime = 30,
        display = document.querySelector("#timer");
    startTimer(WinTime, display);


    // Checking if dragon was defeated. Using s screen reading function.
    //If defeated it will add 1 to score and congrat the winner.
    world.onRender(function(ctx){
        var DragonPos = Geof.position();
        var PikPos = Pik.position();


        //console.log(DragonPos); // I was using this to make sure the position checking was accurate.
        if(DragonPos.y > 30 && !winCondMet){
            console.log(PikPos);
            setTimeout(function(){winCond();}, 1000);

            //setTimeout(winCond(), 50000);
            winCondMet = true;
        }
        if(PikPos.y > 30 && !winCondMet){
            losCond();
        }
        //Changes the colour of the score if it is bellow 0.
        if(localStorage.pageLoadCount < 0){
            document.getElementById("spanScore").style.color = "Red";
        }
        if(localStorage.pageLoadCount >= 0){
            document.getElementById("spanScore").style.color = "Black";
        }

        function winCond(){
            console.warn('winCond[winCondMet='+winCondMet+' DragonPos='+DragonPos.y+' PikPos='+PikPos.y+']');
            PikPos = Pik.position();
            console.log(PikPos.y);
            //Don't win because Pik still died...
            if(PikPos.y > 30){
                draw.play();
                alert("You have defeated the Dragon! Unfortunately you have also died.");
                localStorage.pageLoadCount--;
            }else{
                vic.play();
                alert("You have defeated the Dragon! Congratulations!");
                localStorage.pageLoadCount++;
            }
            document.getElementById('spanScore').textContent = localStorage.pageLoadCount;
            location.reload();
            winCondMet=true;
        }

    });


    //Console checking.
    console.log("Working stuff...");
}

function losCond(){
    los.play();
    alert("You have failed! Try again.");
    localStorage.pageLoadCount--;
    document.getElementById('spanScore').textContent = localStorage.pageLoadCount;
    winCondMet = true;
    location.reload();
}

// Actual timer, this will call a lose if the player takes too long to win.
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
           losCond();
        }
    }, 1000);
}