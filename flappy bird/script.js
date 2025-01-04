const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let bird;
let pipes = [];
let gravity = 0.1; // Reduced gravity for easier gameplay
let birdSpeed = 0;
let birdX = 50;
let birdY = 150;
let birdWidth = 50;
let birdHeight = 50;
let gameScore = 0;
let pipeGap = 250; // Increased gap between pipes for easier navigation
let pipeWidth = 50;
let pipeSpeed = 1; // Slower pipe speed for easier gameplay
let isGameOver = false;
let trees = [];

// Game Over screen
const gameOverScreen = document.getElementById('game-over');
const spaceKey = 32;

// Bird movement control
document.addEventListener('keydown', controlBird);
document.addEventListener('click', controlBird);
document.addEventListener('touchstart', controlBird); // Added for mobile touch

function controlBird(event) {
    if (event.keyCode === spaceKey || event.type === 'click' || event.type === 'touchstart') {
        birdSpeed = -6;
    }
}

function Bird() {
    this.x = birdX;
    this.y = birdY;
    this.width = birdWidth;
    this.height = birdHeight;
    this.flap = function () {
        this.y += birdSpeed;
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
        }
        birdSpeed += gravity;
    };
    this.draw = function () {
        // Bird body
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 25, 20, 0, Math.PI * 2); // Circle body
        ctx.fill();

        // Bird head
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(this.x + 35, this.y + 15, 10, 0, Math.PI * 2); // Circle head
        ctx.fill();

        // Beak
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x + 45, this.y + 15);
        ctx.lineTo(this.x + 55, this.y + 10);
        ctx.lineTo(this.x + 45, this.y + 20);
        ctx.closePath();
        ctx.fill();

        // Wing
        ctx.fillStyle = 'brown';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 25);
        ctx.lineTo(this.x + 30, this.y + 15);
        ctx.lineTo(this.x + 30, this.y + 35);
        ctx.closePath();
        ctx.fill();
    };
}

function Pipe(x) {
    this.x = x;
    this.width = pipeWidth;
    this.top = Math.random() * (canvas.height / 2);
    this.bottom = canvas.height - (this.top + pipeGap);
    this.draw = function () {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    };
    this.update = function () {
        this.x -= pipeSpeed;
    };
    this.isOffscreen = function () {
        return this.x + this.width <= 0;
    };
}

function Tree(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function () {
        // Tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y - 50, 10, 50);

        // Tree foliage
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(this.x - 15, this.y - 50);
        ctx.lineTo(this.x + 25, this.y - 50);
        ctx.lineTo(this.x + 5, this.y - 90);
        ctx.closePath();
        ctx.fill();
    };
    this.update = function () {
        this.x -= pipeSpeed;
        if (this.x < -20) {
            this.x = canvas.width + Math.random() * 200; // Reset tree position
        }
    };
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        pipes.push(new Pipe(canvas.width));
    }
    pipes.forEach(function (pipe, index) {
        pipe.update();
        if (pipe.isOffscreen()) {
            pipes.splice(index, 1);
            gameScore++;
        }
    });
}

function createTrees() {
    if (trees.length === 0) {
        for (let i = 0; i < 5; i++) {
            let x = Math.random() * canvas.width;
            let y = canvas.height - 100;
            trees.push(new Tree(x, y));
        }
    }
}

function updateTrees() {
    trees.forEach(tree => tree.update());
}

function checkCollision() {
    pipes.forEach(function (pipe) {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
            if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
                endGame();
            }
        }
    });
}

function endGame() {
    isGameOver = true;
    gameOverScreen.style.display = 'block';
}

function restartGame() {
    bird = new Bird();
    pipes = [];
    birdSpeed = 0;
    gameScore = 0;
    isGameOver = false;
    gameOverScreen.style.display = 'none';
    pipeSpeed = 1;
    gravity = 0.1;
    pipeGap = 250;
    animate();
}

function startGame() {
    bird = new Bird();
    createTrees();
    animate();
}

function animate() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#87CEEB'; // Sky
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#32CD32'; // Grass
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Draw and update trees
    updateTrees();
    trees.forEach(tree => tree.draw());

    bird.flap();
    bird.draw();

    updatePipes();
    pipes.forEach(function (pipe) {
        pipe.draw();
    });

    checkCollision();

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + gameScore, 10, 30);

    requestAnimationFrame(animate);
}

startGame();
