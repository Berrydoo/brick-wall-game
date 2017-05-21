
var canvas,
    context,
    ballX = 75, 
    ballSpeedX = 5,

    ballY = 100,
    ballSpeedY = 4, 

    paddleY = 10;

const BALL_RADIUS = 10;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 100;


window.onload = function(){

    canvas = document.querySelector("#gameCanvas");
    context = canvas.getContext("2d");

    const framesPerSecond = 30;
    setInterval( updateAll, 1000/framesPerSecond);

}

function updateAll(){

    moveEverything();
    drawEverything(ballX, ballY);
}

function moveEverything(){

    // horizontal movement
    if ( ballX >= (canvas.width - BALL_RADIUS) ){
        ballSpeedX = -ballSpeedX;
    } else if ( ballX <= (0+BALL_RADIUS) ){
        ballSpeedX = -ballSpeedX;
    }

    // vertical movement
    if ( ballY <= (0+BALL_RADIUS) ){
        ballSpeedY = -ballSpeedY;
    } else if( ballY >= (canvas.height - BALL_RADIUS)){
        ballSpeedY = -ballSpeedY;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

function drawEverything( leftX, topY){

    // draw canvas
    context.fillStyle = 'black';
    context.fillRect(0,0,canvas.width, canvas.height);

    // draw ball
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(leftX, topY, BALL_RADIUS, 0, Math.PI*2, false);
    context.fill();

    // draw bottom paddle
    //context.fillRect( canvas.width/2 - PADDLE_WIDTH/2, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);

}