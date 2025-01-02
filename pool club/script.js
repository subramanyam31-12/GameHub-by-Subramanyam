const canvas = document.getElementById('poolCanvas');
const ctx = canvas.getContext('2d');

// Pool table dimensions and ball settings
const table = { width: 800, height: 400 };
const ballRadius = 10;
const balls = [];
const friction = 0.98;

// Cue stick
let cueAngle = 0;
let isDragging = false;
let power = 0;

// Initialize balls
function initBalls() {
  // Example: Add a white cue ball and a red ball
  balls.push({ x: 400, y: 200, dx: 0, dy: 0, color: 'white' });
  balls.push({ x: 450, y: 200, dx: 0, dy: 0, color: 'red' });
}

// Draw the table
function drawTable() {
  ctx.fillStyle = '#004b23';
  ctx.fillRect(0, 0, table.width, table.height);

  // Draw pockets (simplified for now)
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.arc(table.width, 0, 20, 0, Math.PI * 2);
  ctx.arc(0, table.height, 20, 0, Math.PI * 2);
  ctx.arc(table.width, table.height, 20, 0, Math.PI * 2);
  ctx.fill();
}

// Draw balls
function drawBalls() {
  balls.forEach(ball => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
  });
}

// Move balls
function moveBalls() {
  balls.forEach(ball => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.x - ballRadius < 0 || ball.x + ballRadius > table.width) ball.dx *= -1;
    if (ball.y - ballRadius < 0 || ball.y + ballRadius > table.height) ball.dy *= -1;

    // Apply friction
    ball.dx *= friction;
    ball.dy *= friction;

    // Stop ball if velocity is small
    if (Math.abs(ball.dx) < 0.1) ball.dx = 0;
    if (Math.abs(ball.dy) < 0.1) ball.dy = 0;
  });
}

// Handle cue stick mechanics
function drawCue() {
  const cueBall = balls[0];
  const cueX = cueBall.x + Math.cos(cueAngle) * (ballRadius + 10);
  const cueY = cueBall.y + Math.sin(cueAngle) * (ballRadius + 10);

  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cueBall.x, cueBall.y);
  ctx.lineTo(cueX, cueY);
  ctx.stroke();
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTable();
  drawBalls();
  drawCue();
  moveBalls();
  requestAnimationFrame(animate);
}

// Mouse controls for cue stick
canvas.addEventListener('mousemove', event => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const cueBall = balls[0];
  cueAngle = Math.atan2(mouseY - cueBall.y, mouseX - cueBall.x);
});

// Simulate cue hit
canvas.addEventListener('mousedown', () => {
  const cueBall = balls[0];
  cueBall.dx = Math.cos(cueAngle) * 5;
  cueBall.dy = Math.sin(cueAngle) * 5;
});

initBalls();
animate();
