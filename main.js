
var canvas,
    context,

    ballX = 75, 
    ballY = 100,

    ballSpeedX = 8,
    ballSpeedY = 7, 

    paddleX = 400,
    paddleY = 10, 

    mouseX, 
    mouseY,

    bricks = [];

var Paddle = {
    height: 10,
    width: 100,
    distFromEdge: 60
};

var BrickDims = {
    width: 80,
    height: 20,
    gap: 2,
    rows: 14,
    bricksPerRow: 10
};

var Ball = {
    radius: 10
};

window.onload = function(){

    canvas = document.querySelector("#gameCanvas");
    context = canvas.getContext("2d");

    canvas.addEventListener('mousemove', updateMousePos);

    createBricks();

    const framesPerSecond = 30;
    setInterval( updateAll, 1000/framesPerSecond);

}

function updateAll(){

    moveEverything();
    drawEverything();
}

function moveEverything(){

    // horizontal movement
    if ( ballX >= (canvas.width - Ball.radius) ){ // right side
        ballSpeedX = -ballSpeedX;
    } else if ( ballX <= (0+Ball.radius) ){ // left side
        ballSpeedX = -ballSpeedX;
    }

    // vertical movement
    if ( ballY <= (0+Ball.radius) ){     // top
        ballSpeedY = -ballSpeedY;
    } else if( ballY >= (canvas.height - Ball.radius)){ //bottom
        ballReset();
    }

    var ballBrickCol = Math.floor(ballX/BrickDims.width),
        ballBrickRow = Math.floor(ballY/BrickDims.height),
        brickIndex = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    if( ballBrickCol >= 0 && ballBrickCol < BrickDims.bricksPerRow && 
        ballBrickRow >= 0 && ballBrickRow < BrickDims.rows && 
        brickIndex < (BrickDims.bricksPerRow * BrickDims.rows) ){ 
        if( bricks[brickIndex] != null){
            bricks[brickIndex].isVisible = false;
        } else {
            console.log("No bricks at index " + brickIndex );
        }
    }

    var paddleTopEdgeY = canvas.height - Paddle.distFromEdge,
        paddleBottomEdgeY = paddleTopEdgeY + Paddle.height,
        paddleLeftEdgeX = paddleX,
        paddleRightEdgeX = paddleLeftEdgeX + Paddle.width;

    if ( ballY > paddleTopEdgeY &&      // below top of paddle
         ballY < paddleBottomEdgeY &&   // above bottom of paddle
         ballX > paddleLeftEdgeX &&     // ball to right of left edge
         ballX < paddleRightEdgeX ){    // ball to left of right edge
            ballSpeedY = -ballSpeedY;

            var centerOfPaddleX = paddleX + Paddle.width/2,
                ballDistFromPaddleCenterX = ballX - centerOfPaddleX;

                ballSpeedX = ballDistFromPaddleCenterX * 0.35;
         }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

function drawEverything(){

    // draw canvas
    colorRect(0,0,canvas.width, canvas.height, 'black');

    // draw bricks
    drawBricks();

    // draw ball
    colorCircle(ballX, ballY, Ball.radius, 'white');

    // draw bottom paddle
    colorRect(paddleX, canvas.height - Paddle.distFromEdge, Paddle.width, Paddle.height, 'white');

}

function drawMousePosition(){
    
    // draw mouse position
    var mouseBrickCol = Math.floor(mouseX/BrickDims.width),
        mouseBrickRow = Math.floor( mouseY/BrickDims.height),
        brickIndex = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
    colorText( mouseBrickCol + "," + mouseBrickRow + ":" + brickIndex, mouseX +10 , mouseY + 5, 'yellow');

}

function createBricks(){
    for( var row = 0; row < BrickDims.rows; row++){
        for( var column = 0; column < BrickDims.bricksPerRow; column++){
            bricks.push( new Brick( BrickDims.width * column, BrickDims.height * row, row, column, true ) );
        }
    }
}

function drawBricks(){

    bricks.forEach( function(brick){
        if( brick.isVisible ){
            colorRect( brick.x, brick.y, BrickDims.width-BrickDims.gap, BrickDims.height - BrickDims.gap, 'blue');
        }
    });
}

function rowColToArrayIndex( col, row ){
    return col + (BrickDims.bricksPerRow * row);
}

function colorRect(leftX, topY, width, height, drawColor){
    context.fillStyle = drawColor;
    context.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor){
    context.fillStyle = drawColor;
    context.beginPath();
    context.arc( centerX, centerY, radius, 0, Math.PI * 2, true);
    context.fill();
}

function colorText( showWords, textX, textY, fillColor ){
    context.fillStyle = fillColor;
    context.fillText( showWords, textX, textY);
}

function updateMousePos(evt){

    var rect = canvas.getBoundingClientRect(), 
        root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;  
    mouseY = evt.clientY - rect.top - root.scrollTop;
    
    paddleX = mouseX - Paddle.width/2;

}

function ballReset(){
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function Brick( x, y, rowNum, colNum, isVisible){
    this.x = x;
    this.y = y;
    this.row = rowNum;
    this.column = colNum;
    this.isVisible = isVisible;
}