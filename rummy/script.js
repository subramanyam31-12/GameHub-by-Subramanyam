const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400; // Fixed width for the road
canvas.height = window.innerHeight;

// Game Variables
let player = { x: 180, y: canvas.height - 120, width: 40, height: 80, color: "#00ffcc", speed: 5 };
let enemyCars = [];
let roadMarkers = [];
let powerUps = [];
let score = 0;
let level = 1;
let lives = 3;
let gameOver = false;

// Utility Functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create Lane Markers
function createMarkers() {
  for (let i = 0; i < canvas.height; i += 60) {
    roadMarkers.push({ x: canvas.width / 2 - 5, y: i, width: 10, height: 40 });
  }
}

// Draw Lane Markers
function drawMarkers() {
  ctx.fillStyle = "#ffffff";
  roadMarkers.forEach(marker => {
    ctx.fillRect(marker.x, marker.y, marker.width, marker.height);
  });
}

// Update Lane Markers
function updateMarkers() {
  roadMarkers.forEach(marker => {
    marker.y += 5 + level;
    if (marker.y > canvas.height) marker.y = -40;
  });
}

// Draw Player Car
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Create Enemy Cars
function createEnemyCar() {
  const laneX = [100, 180, 260]; // Lane positions
  const randomLane = laneX[getRandomInt(0, laneX.length - 1)];
  enemyCars.push({
    x: randomLane,
    y: -100,
    width: 40,
    height: 80,
    speed: getRandomInt(3, 6 + level),
    color: `hsl(${getRandomInt(0, 360)}, 80%, 50%)`,
  });
}

// Draw Enemy Cars
function drawEnemyCars() {
  enemyCars.forEach(car => {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
  });
}

// Update Enemy Cars
function updateEnemyCars() {
  enemyCars.forEach((car, index) => {
    car.y += car.speed;

    // Collision Detection
    if (
      player.x < car.x + car.width &&
      player.x + player.width > car.x &&
      player.y < car.y + car.height &&
      player.y + player.height > car.y
    ) {
      lives--;
      enemyCars.splice(index, 1);
      if (lives <= 0) endGame();
    }

    // Remove cars that go off-screen
    if (car.y > canvas.height) {
      score += 10; // Reward for overtaking
      enemyCars.splice(index, 1);
    }
  });
}

// Draw Power-Ups
function drawPowerUps() {
  ctx.fillStyle = "#ffff33";
  powerUps.forEach(pu => {
    ctx.beginPath();
    ctx.arc(pu.x, pu.y, pu.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
}

// Update Power-Ups
function updatePowerUps() {
  powerUps.forEach((pu, index) => {
    pu.y += 3 + level;

    // Collision with player
    const dist = Math.hypot(player.x + player.width / 2 - pu.x, player.y + player.height / 2 - pu.y);
    if (dist < player.width / 2 + pu.size / 2) {
      powerUps.splice(index, 1);
      player.speed += 2; // Temporary boost
      setTimeout(() => {
        player.speed = 5;
      }, 5000);
    }
  });
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Road
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Road Markers
  drawMarkers();
  updateMarkers();

  // Draw Cars and Power-ups
  drawPlayer();
  drawEnemyCars();
  updateEnemyCars();
  drawPowerUps();
  updatePowerUps();

  // Display Score and Lives
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 60);

  // Level Up
  if (score % 100 === 0 && score > 0) {
    level++;
  }

  if (!gameOver) requestAnimationFrame(gameLoop);
}

// End Game
function endGame() {
  gameOver = true;
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
  ctx.font = "20px Arial";
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 80, canvas.height / 2 + 20);
}

// Event Listeners
window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && player.x > 100) player.x -= 80; // Move to the left lane
  if (e.key === "ArrowRight" && player.x < 260) player.x += 80; // Move to the right lane
});

// Initialize Game
createMarkers();
setInterval(createEnemyCar, 1500); // Spawn cars
setInterval(() => {
  const laneX = [100, 180, 260];
  const randomLane = laneX[getRandomInt(0, laneX.length - 1)];
  powerUps.push({ x: randomLane + 20, y: -50, size: 20 });
}, 10000); // Spawn power-ups every 10 seconds

gameLoop();
