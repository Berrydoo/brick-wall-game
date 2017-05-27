
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

    bricks = [],
    bricksLeft = 0;

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

    const framesPerSecond = 30;
    setInterval( updateAll, 1000/framesPerSecond);

    canvas.addEventListener('mousemove', updateMousePos);

    createBricks();
    ballReset();

}

function updateAll(){

    moveEverything();
    drawEverything();
}

function isBrickAtColRow( col, row){
    
    if( col >= 0 && col < BrickDims.bricksPerRow &&
        row >= 0 && row < BrickDims.rows ){

        var brickIndexUnderCoord = rowColToArrayIndex( col, row);
        return bricks[brickIndexUnderCoord].isVisible; 

    } else {
        return false;
    }
}

// this moves the ball around the screen, 
// bouncing off the edges of the screen
function ballMove(){

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if ( ballX < 0 && ballSpeedX < 0.0){
        ballSpeedX *= -1;
    }

    if ( ballX > canvas.width && ballSpeedX > 0.0 ){
        ballSpeedX *= -1;
    }

    if ( ballY < 0 && ballSpeedY < 0.0 ){
        ballSpeedY *= -1;
    }

    if ( ballY > canvas.height ){
        ballReset();
        createBricks();        
    }

}

function ballBrickHandling(){

    var ballBrickCol = Math.floor(ballX/BrickDims.width),
        ballBrickRow = Math.floor(ballY/BrickDims.height),
        brickIndex = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    if( ballBrickCol >= 0 && ballBrickCol < BrickDims.bricksPerRow && 
        ballBrickRow >= 0 && ballBrickRow < BrickDims.rows ){ 

        if( isBrickAtColRow(ballBrickCol, ballBrickRow) ){
        
                bricks[brickIndex].isVisible = false;
                bricksLeft--;
                console.log('remove brick: ' + ballBrickCol, ballBrickRow);

                var prevBallX = ballX - ballSpeedX, 
                    prevBallY = ballY - ballSpeedY,
                    prevBallBrickCol = Math.floor(prevBallX / BrickDims.width),
                    prevBallBrickRow = Math.floor(prevBallY / BrickDims.height), 
                    bothTestsFailed = true;
                
                if( prevBallBrickCol != ballBrickCol ){

                    if( !isBrickAtColRow(prevBallBrickCol, ballBrickRow) ){                             
                             bothTestsFailed = false;
                             ballSpeedY *= -1;
                             console.log( 'flipping ball Y to ' + ballSpeedY);
                    }
                }
                
                if( prevBallBrickRow != ballBrickRow ){
                    if( !isBrickAtColRow(ballBrickCol, prevBallBrickRow) ){
                            bothTestsFailed = false;
                            ballSpeedX *= -1;
                            console.log('flipping ball X to ' + ballSpeedX);
                    }
                }

                if( bothTestsFailed ){
                    ballSpeedX *= -1;
                    ballSpeedY *= -1;
                    console.log( 'flipping ball X and Y to ' + ballSpeedX, ballSpeedY);
                }

        }
    }
}

function ballPaddleHandling(){

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
            
            if( bricksLeft == 0 ){
                createBricks();
            }
    }

}

function moveEverything(){

    ballMove();
    ballBrickHandling();
    ballPaddleHandling();

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

    bricksLeft = 0;
    bricks = [];

    for( var row = 0; row < BrickDims.rows; row++){
        for( var column = 0; column < BrickDims.bricksPerRow; column++){

            bricks.push( new Brick( BrickDims.width * column, BrickDims.height * row, row, column, row > 3 ) );
            if ( row > 3 ){
                bricksLeft++;
            }

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

    // ballX = mouseX;
    // ballY = mouseY;
    // ballSpeedX =  4;
    // ballSpeedY = -4;
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