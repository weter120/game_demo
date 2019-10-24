class Paddle {
    constructor(game) {
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.width = 150;
        this.height = 30;
        this.maxSpeed = 7;
        this.speed = 0;
        this.position = {
            x: this.gameWidth / 2 - this.width / 2,
            y: this.gameHeight - this.height - 10
        }
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }
    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    draw(context) {
        context.fillStyle = '#f01'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update(deltatime) {
        // if(!deltatime) return;
        this.position.x += this.speed;

        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > this.gameWidth) this.position.x = this.gameWidth - this.width;
    }
}

class InputHandler {
    constructor(paddle, game) {
        document.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 37:
                    paddle.moveLeft();
                    break;
                case 39:
                    paddle.moveRight();
                    break;
                case 27:
                    game.togglePause();
            }
        });
        document.addEventListener('keyup', (event) => {
            switch (event.keyCode) {
                case 37:
                    if (paddle.speed < 0) paddle.stop();
                    break;
                case 39:
                    if (paddle.speed > 0) paddle.stop();
                    break;
            }
        });
    }
}

class Ball {
    constructor(game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.image = document.getElementById('img_ball');
        this.speed = { x: 4, y: -2 };
        this.position = { x: 10, y: 400 };
        this.size = 16;
        this.game = game;
    }

    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
    }

    update(deltatime) {

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
            this.speed.x = -this.speed.x;
        }
        if (this.position.y + this.size > this.gameHeight || this.position.y < 0) {
            this.speed.y = -this.speed.y;
        }

        // let bottomOfBall = this.position.y + this.size;
        // let topOfPaddle = this.game.paddle.position.y;
        // let leftSideOfPadlle = this.game.paddle.position.x;
        // let rigthSideOfPaddle = this.game.paddle.position.x + this.game.paddle.width;

        // if (bottomOfBall >= topOfPaddle && this.position.x >= leftSideOfPadlle && this.position.x + this.size <= rigthSideOfPaddle)
        if (detectCollision(this, this.game.paddle)) {
            this.speed.y = -this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}

class Brick {
    constructor(game, position) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
        this.position = position;
        this.width = 80;
        this.height = 24;
        this.image = document.getElementById('img_brick');
        this.markedForDeletion = false;
    }
    update() {
        if(detectCollision(this.game.ball, this)){
            this.game.ball.speed.y = -this.game.ball.speed.y;
            this.markedForDeletion = true;
        }
    }
    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

    }
}

function detectCollision(ball, gameObject) {
    let topOfBall = ball.position.y;
    let bottomOfBall = ball.position.y + ball.size;
    let topOfObject = gameObject.position.y;
    let leftSideOfObject = gameObject.position.x;
    let rigthSideOfObject = gameObject.position.x + gameObject.width;
    let bottomOfObject = gameObject.position.y + gameObject.height;

    if (bottomOfBall >= topOfObject && topOfBall <= bottomOfObject && ball.position.x >= leftSideOfObject && ball.position.x + ball.size <= rigthSideOfObject) {
        return true;
    } else {
        return false;
    }
}

function buildLevel(game, level) {
    let bricks = [];

    level.forEach((row, rowIndex) => {
        row.forEach((brick, brickIndex) => {
            if (brick === 1) {
                let position = {
                    x: 80 * brickIndex,
                    y: 75 + 24 * rowIndex
                };
                bricks.push(new Brick(game, position));
            }
        });
    });
    return bricks;
}
const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3
}

const level1 = [
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
];



class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

    }

    start() {
        // this.gameState = GAMESTATE.
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        // this.Brick = new Brick(this)
        let bricks = buildLevel(this, level1);
        // for (let i = 0; i<10; i++){
        //     bricks.push(new Brick(this, {x:i*52, y:30}));
        // }
        this.gameObjects = [this.ball, this.paddle, ...bricks];
        new InputHandler(this.paddle, this);
    }

    update(deltatime) {
        // this.paddle.update(deltatime);
        // this.ball.update(deltatime);
        this.gameObjects.forEach((object) => { object.update(deltatime) });
        this.gameObjects = this.gameObjects.filter(object => !object.markedForDeletion);
    }

    draw() {
        // this.paddle.draw(context);
        // this.ball.draw(context);
        this.gameObjects.forEach((object) => { object.draw(context) });
    }

    togglePause(){

    }
}



let canvas = document.getElementById("gameScreen");

let context = canvas.getContext("2d");


const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;


let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();

let lastTime = 0;


function gameLoop(timestamp) {

    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // paddle.update(deltatime);
    // paddle.draw(context);

    // ball.draw(context);
    // ball.update(deltatime);

    game.update(deltatime);
    game.draw(context);


    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);



