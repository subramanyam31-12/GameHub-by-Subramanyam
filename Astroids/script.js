const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const spaceshipRadius = 15;
const asteroidRadius = 20;
const bulletRadius = 5;
const asteroidSpeed = 1;
const bulletSpeed = 5;

// Game variables
let spaceship = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, speed: 0, rotation: 0 };
let asteroids = [];
let bullets = [];
let score = 0;

// Controls
let keys = { up: false, left: false, right: false, space: false };

// Event listeners for controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " ") keys.space = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === " ") keys.space = false;
});

// Spaceship update
function updateSpaceship() {
  if (keys.left) spaceship.angle -= 0.05;
  if (keys.right) spaceship.angle += 0.05;
  if (keys.up) {
    spaceship.speed = 0.2;
  } else {
    spaceship.speed = 0;
  }

  spaceship.x += spaceship.speed * Math.cos(spaceship.angle);
  spaceship.y += spaceship.speed * Math.sin(spaceship.angle);

  if (spaceship.x < 0) spaceship.x = canvas.width;
  if (spaceship.x > canvas.width) spaceship.x = 0;
  if (spaceship.y < 0) spaceship.y = canvas.height;
  if (spaceship.y > canvas.height) spaceship.y = 0;
}

// Bullet update
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    bullet.x += bullet.speed * Math.cos(bullet.angle);
    bullet.y += bullet.speed * Math.sin(bullet.angle);

    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

// Asteroid update
function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    let asteroid = asteroids[i];
    asteroid.x += asteroid.speed * Math.cos(asteroid.angle);
    asteroid.y += asteroid.speed * Math.sin(asteroid.angle);

    if (asteroid.x < 0) asteroid.x = canvas.width;
    if (asteroid.x > canvas.width) asteroid.x = 0;
    if (asteroid.y < 0) asteroid.y = canvas.height;
    if (asteroid.y > canvas.height) asteroid.y = 0;

    // Check for collision with bullets
    for (let j = 0; j < bullets.length; j++) {
      let bullet = bullets[j];
      let distance = Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y);
      if (distance < asteroidRadius + bulletRadius) {
        asteroids.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        i--;
        break;
      }
    }

    // Check for collision with spaceship
    let distance = Math.hypot(spaceship.x - asteroid.x, spaceship.y - asteroid.y);
    if (distance < spaceshipRadius + asteroidRadius) {
      gameOver();
    }
  }
}

// Draw functions
function drawSpaceship() {
  ctx.save();
  ctx.translate(spaceship.x, spaceship.y);
  ctx.rotate(spaceship.angle);
  ctx.beginPath();
  ctx.moveTo(0, -spaceshipRadius);
  ctx.lineTo(10, spaceshipRadius);
  ctx.lineTo(-10, spaceshipRadius);
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.restore();
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bulletRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAsteroids() {
  ctx.fillStyle = "gray";
  for (let i = 0; i < asteroids.length; i++) {
    let asteroid = asteroids[i];
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroidRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function gameOver() {
  alert("Game Over! Final Score: " + score);
  resetGame();
}

function resetGame() {
  spaceship = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, speed: 0, rotation: 0 };
  asteroids = [];
  bullets = [];
  score = 0;
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateSpaceship();
  updateBullets();
  updateAsteroids();
  drawSpaceship();
  drawBullets();
  drawAsteroids();
  drawScore();

  if (Math.random() < 0.01) {
    let angle = Math.random() * Math.PI * 2;
    let speed = asteroidSpeed + Math.random();
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    asteroids.push({ x, y, angle, speed });
  }

  requestAnimationFrame(gameLoop);
}

// Shoot bullet when space is pressed
function shootBullet() {
  if (keys.space) {
    let angle = spaceship.angle;
    let x = spaceship.x + Math.cos(angle) * spaceshipRadius;
    let y = spaceship.y + Math.sin(angle) * spaceshipRadius;
    bullets.push({ x, y, angle, speed: bulletSpeed });
  }
}

gameLoop();
setInterval(shootBullet, 100); // Shoot bullet every 100ms
