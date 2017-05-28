
var canvas,
    context,
    debugging = false;

var Globals = {
    brickWidth: 100,
    brickHeight: 20,
    brickGap: 2
};

var bricksGrid = {
    rows: 13,
    columns: 8,
    bricks: [],
    bricksLeft: 0,
    isBallWithinGrid: function(){

        var currentColumn = ball.currentColumn(),
            currentRow = ball.currentRow(),
            brickIndex = rowColToArrayIndex( currentColumn, currentRow);

        if( currentColumn >= 0 && currentColumn < bricksGrid.columns && 
            currentRow >= 0 && currentRow < bricksGrid.rows ){ 
                return true;
            } else {
                return false;
            }
    }
}

var mouse = {
    x: 0,
    y: 0
};

var paddle = {
    x: 400,
    y: 10,
    height: 10,
    width: 100,
    distFromEdge: 60, 
    isBallTouchingPaddle: function(){
        var paddleTopEdgeY = canvas.height - paddle.distFromEdge,
            paddleBottomEdgeY = paddleTopEdgeY + paddle.height,
            paddleLeftEdgeX = paddle.x,
            paddleRightEdgeX = paddleLeftEdgeX + paddle.width;

        if ( ball.y > paddleTopEdgeY &&      // below top of paddle
             ball.y < paddleBottomEdgeY &&   // above bottom of paddle
             ball.x > paddleLeftEdgeX &&     // ball to right of left edge
             ball.x < paddleRightEdgeX ){    // ball to left of right edge
                return true;
        } else {
                return false;
        }
    }
};

function Brick( x, y, rowNum, colNum, isVisible, index){
    this.x = x;
    this.y = y;
    this.row = rowNum;
    this.column = colNum;
    this.isVisible = isVisible;
    this.index = index;
}

var ball = {
    x: 75, 
    y: 100,
    speedX: 8, 
    speedY: 7,
    radius: 10,
    color: 'white',
    currentColumn: function(){ return Math.floor(ball.x / Globals.brickWidth ); },
    previousColumn: function(){ return Math.floor( (ball.x - ball.speedX)/ Globals.brickWidth ); },
    currentRow: function(){ return Math.floor( ball.y / Globals.brickHeight ); },
    previousRow: function(){ return Math.floor( (ball.y - ball.speedY) / Globals.brickHeight ); }
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


function moveEverything(){

    ballMove();
    ballBrickHandling();
    ballPaddleHandling();

}

// this moves the ball around the screen, 
// bouncing off the edges of the screen
function ballMove(){

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if ( ball.x < 0 && ball.speedX < 0.0){
        ball.speedX *= -1;
    }

    if ( ball.x > canvas.width && ball.speedX > 0.0 ){
        ball.speedX *= -1;
    }

    if ( ball.y < 0 && ball.speedY < 0.0 ){
        ball.speedY *= -1;
    }

    if ( ball.y > canvas.height ){
        ballReset();
        createBricks();        
    }
}

function ballBrickHandling(){

    if( bricksGrid.isBallWithinGrid() ){ 

        if( isBrickAtColRow(ball.currentColumn(), ball.currentRow() ) ){
        
                var brickIndex = rowColToArrayIndex( ball.currentColumn(), ball.currentRow() );
                bricksGrid.bricks[ brickIndex ].isVisible = false;
                bricksGrid.bricksLeft--;
                
                var bothTestsFailed = true;
                
                if( ball.previousColumn() != ball.currentColumn() ){

                    if( !isBrickAtColRow(ball.previousColumn(), ball.currentRow() ) ){                             
                             bothTestsFailed = false;
                             ball.speedX *= -1;
                    }
                }
                
                if( ball.previousRow() != ball.currentRow() ){
                    if( !isBrickAtColRow(ball.currentColumn(), ball.previousRow()) ){
                            bothTestsFailed = false;
                            ball.speedY *= -1;
                    }
                }

                if( bothTestsFailed ){
                    ball.speedX *= -1;
                    ball.speedY *= -1;
                }
        }
    }
}

function ballPaddleHandling(){

    if ( paddle.isBallTouchingPaddle() ){    // ball to left of right edge

            ball.speedY = -1 * ball.speedY;

            var centerOfPaddleX = paddle.x + paddle.width/2,
                ballDistFromPaddleCenterX = ball.x - centerOfPaddleX;

                ball.speedX = ballDistFromPaddleCenterX * 0.35;
            
            if( bricksGrid.bricksLeft == 0 ){
                createBricks();
            }
    }
}

function drawEverything(){

    // draw canvas
    colorRect(0,0,canvas.width, canvas.height, 'black');

    // draw bricks
    drawBricks();

    // draw ball
    colorCircle(ball.x, ball.y, ball.radius, 'white');

    // draw bottom paddle
    colorRect(paddle.x, canvas.height - paddle.distFromEdge, paddle.width, paddle.height, 'white');

    // draw mouse position
    if( debugging ){
        drawMousePosition();
        drawBallPosition();
    }
}

function drawBricks(){

    bricksGrid.bricks.forEach( function(brick){
        if( brick.isVisible ){
            colorRect( brick.x, brick.y, Globals.brickWidth - Globals.brickGap, Globals.brickHeight - Globals.brickGap, 'blue');
            if( debugging ){
                colorText( brick.index, brick.x + Globals.brickWidth/2, brick.y + Globals.brickHeight/2, 'white');
            }
        }
    });
}

function drawMousePosition(){
    
    var mouseBrickCol = Math.floor(mouse.x/ Globals.brickWidth),
        mouseBrickRow = Math.floor( mouse.y/ Globals.brickHeight),
        brickIndex = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);

    colorText( mouseBrickCol + "," + mouseBrickRow + ":" + brickIndex + ':' + mouse.x + ',' + mouse.y, mouse.x +10 , mouse.y + 5, 'yellow');

}

function drawBallPosition(){

    // var ballCol = Math.floor( ball.x/ Globals.brickWidth),
    //     ballRow = Math.floor( ball.y/ Globals.brickHeight),
    var    brickIndex = rowColToArrayIndex( ball.currentColumn(), ball.currentRow());

    colorText( ball.currentColumn() + "," + ball.currentRow() + ":" + brickIndex, ball.x + 20 , ball.y + 20 + ':' + ball.x + ',' + ball.y, 'yellow');

}

function isBrickAtColRow( col, row){
    
    if( bricksGrid.isBallWithinGrid() ){

        var brickIndexUnderCoord = rowColToArrayIndex( col, row);
        if( bricksGrid.bricks[brickIndexUnderCoord] != null ){
            return bricksGrid.bricks[brickIndexUnderCoord].isVisible; 
        } else {
            return false;
        }

    } else {
        return false;
    }
}

function rowColToArrayIndex( col, row ){
    return col + (bricksGrid.columns * row);
}

function createBricks(){

    bricksGrid.bricksLeft = 0;
    bricksGrid.bricks = [];

    var index = 0;

    for( var row = 0; row < bricksGrid.rows; row++){
        for( var column = 0; column < bricksGrid.columns; column++){
            bricksGrid.bricks.push( new Brick( Globals.brickWidth * column, Globals.brickHeight * row, row, column, row > 3, index++) );
            if ( row > 3 ){
                bricksGrid.bricksLeft++;
            }
        }
    }
}

function updateMousePos(evt){

    var rect = canvas.getBoundingClientRect(), 
        root = document.documentElement;

    
    mouse.x = evt.clientX - rect.left - root.scrollLeft;  
    mouse.y = evt.clientY - rect.top - root.scrollTop;

    paddle.x = mouse.x - paddle.width/2;

}

function ballReset(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
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