// Setup canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let snake, food, direction, score, gameInterval;
let gameStarted = false;

// Button elements
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const quitBtn = document.getElementById("quitBtn");
const scoreDisplay = document.getElementById("scoreDisplay");

// Function to generate random food position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

// Initialize the game
function initGame() {
    snake = [{ x: 160, y: 160 }];
    direction = { x: gridSize, y: 0 }; // Initially move to the right
    score = 0;
    gameStarted = true;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    quitBtn.style.display = 'inline-block';
    gameInterval = setInterval(update, 100); // Update game state every 100ms
}

// Function to draw the snake and food
function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // Draw the snake
    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Function to update the game state
function update() {
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head); // Add new head

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood(); // Generate new food
    } else {
        snake.pop(); // Remove the last part of the snake
    }

    // Check for collision with walls
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        endGame("Game Over! You hit the wall.");
    }

    // Check for collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame("Game Over! You collided with yourself.");
        }
    }

    // Update score display
    scoreDisplay.textContent = `Score: ${score}`;
    draw();
}

// End game and show message
function endGame(message) {
    clearInterval(gameInterval);
    alert(message);
    gameStarted = false;
    startBtn.style.display = 'inline-block';
    restartBtn.style.display = 'inline-block';
    quitBtn.style.display = 'inline-block';
}

// Handle key events for snake direction
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

// Start game when start button is clicked
startBtn.addEventListener("click", () => {
    initGame();
});

// Restart game when restart button is clicked
restartBtn.addEventListener("click", () => {
    initGame();
});

// Quit game when quit button is clicked
quitBtn.addEventListener("click", () => {
    window.location.reload();
});
