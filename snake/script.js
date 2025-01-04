const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let snake, food, direction, score, gameInterval;
let gameStarted = false;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const quitBtn = document.getElementById("quitBtn");
const scoreDisplay = document.getElementById("scoreDisplay");

const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

function initGame() {
    snake = [{ x: 160, y: 160 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    gameStarted = true;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    quitBtn.style.display = 'inline-block';
    gameInterval = setInterval(update, 100);
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function update() {
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        endGame("Game Over!");
    }

    scoreDisplay.textContent = `Score: ${score}`;
    draw();
}

function endGame(message) {
    clearInterval(gameInterval);
    alert(message);
    gameStarted = false;
    startBtn.style.display = 'inline-block';
    restartBtn.style.display = 'inline-block';
    quitBtn.style.display = 'inline-block';
}

document.addEventListener("keydown", (event) => {
    if (!gameStarted) return;

    if (event.key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (event.key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (event.key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (event.key === "ArrowRight" && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
});

upBtn.addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: -gridSize };
});

downBtn.addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: gridSize };
});

leftBtn.addEventListener("click", () => {
    if (direction.x === 0) direction = { x: -gridSize, y: 0 };
});

rightBtn.addEventListener("click", () => {
    if (direction.x === 0) direction = { x: gridSize, y: 0 };
});

startBtn.addEventListener("click", initGame);
restartBtn.addEventListener("click", initGame);
quitBtn.addEventListener("click", () => location.reload());
