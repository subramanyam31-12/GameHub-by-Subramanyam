const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size for mobile compatibility
canvas.width = Math.min(window.innerWidth - 20, 400);
canvas.height = canvas.width;

const gridSize = 20;
const canvasSize = canvas.width;
let snake, food, direction, nextDirection, score, lastUpdateTime;
let gameRunning = false;

// Buttons for mobile controls
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    };
}

function initGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: gridSize, y: 0 };
    nextDirection = direction; // Track the next direction
    score = 0;
    generateFood();
    gameRunning = true;
    lastUpdateTime = 0;
    startBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "lime";
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function update() {
    // Update direction only if it's not reversing
    if (
        (nextDirection.x !== -direction.x || nextDirection.y !== -direction.y)
    ) {
        direction = nextDirection;
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    // Check collisions
    if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= canvasSize ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
        gameOver();
    }
}

function gameOver() {
    gameRunning = false;
    alert(`Game Over! Your score: ${score}`);
    startBtn.style.display = "inline-block";
    restartBtn.style.display = "inline-block";
}

function gameLoop(timestamp) {
    if (!gameRunning) return;

    const timeElapsed = timestamp - lastUpdateTime;
    if (timeElapsed > 100) {
        update();
        draw();
        lastUpdateTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction.y === 0) {
        nextDirection = { x: 0, y: -gridSize };
    } else if (e.key === "ArrowDown" && direction.y === 0) {
        nextDirection = { x: 0, y: gridSize };
    } else if (e.key === "ArrowLeft" && direction.x === 0) {
        nextDirection = { x: -gridSize, y: 0 };
    } else if (e.key === "ArrowRight" && direction.x === 0) {
        nextDirection = { x: gridSize, y: 0 };
    }
});

// Mobile controls
upBtn.addEventListener("click", () => {
    if (direction.y === 0) nextDirection = { x: 0, y: -gridSize };
});
downBtn.addEventListener("click", () => {
    if (direction.y === 0) nextDirection = { x: 0, y: gridSize };
});
leftBtn.addEventListener("click", () => {
    if (direction.x === 0) nextDirection = { x: -gridSize, y: 0 };
});
rightBtn.addEventListener("click", () => {
    if (direction.x === 0) nextDirection = { x: gridSize, y: 0 };
});

startBtn.addEventListener("click", initGame);
restartBtn.addEventListener("click", initGame);
