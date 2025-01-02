// Variables
const grid = Array.from({ length: 4 }, () => Array(4).fill(0));
let score = 0;

// Selectors
const gridContainer = document.getElementById('grid-container');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart');

// Initialize game
document.addEventListener('DOMContentLoaded', startGame);
restartButton.addEventListener('click', startGame);

document.addEventListener('keydown', handleInput);

// Start the game
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    resetGrid();
    addRandomTile();
    addRandomTile();
    renderGrid();
}

// Reset the grid
function resetGrid() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            grid[row][col] = 0;
        }
    }
}

// Add a random tile
function addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) emptyCells.push([row, col]);
        }
    }

    if (emptyCells.length > 0) {
        const [randomRow, randomCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Handle keyboard input
function handleInput(e) {
    const key = e.key;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;

    let moved = false;
    if (key === 'ArrowUp') moved = slideTiles(0, -1);
    if (key === 'ArrowDown') moved = slideTiles(0, 1);
    if (key === 'ArrowLeft') moved = slideTiles(-1, 0);
    if (key === 'ArrowRight') moved = slideTiles(1, 0);

    if (moved) {
        addRandomTile();
        renderGrid();
        if (checkGameOver()) alert('Game Over!');
    }
}

// Slide tiles
function slideTiles(dx, dy) {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let currentRow = row;
            let currentCol = col;
            while (true) {
                const nextRow = currentRow + dy;
                const nextCol = currentCol + dx;

                if (
                    nextRow < 0 ||
                    nextRow >= 4 ||
                    nextCol < 0 ||
                    nextCol >= 4 ||
                    (grid[nextRow][nextCol] !== 0 && grid[nextRow][nextCol] !== grid[currentRow][currentCol])
                ) {
                    break;
                }

                if (grid[nextRow][nextCol] === grid[currentRow][currentCol]) {
                    grid[nextRow][nextCol] *= 2;
                    score += grid[nextRow][nextCol];
                    grid[currentRow][currentCol] = 0;
                    moved = true;
                    break;
                }

                if (grid[nextRow][nextCol] === 0) {
                    grid[nextRow][nextCol] = grid[currentRow][currentCol];
                    grid[currentRow][currentCol] = 0;
                    currentRow = nextRow;
                    currentCol = nextCol;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

// Render the grid
function renderGrid() {
    gridContainer.innerHTML = '';
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[row][col] === 0 ? '' : grid[row][col];
            cell.style.background = getTileColor(grid[row][col]);
            gridContainer.appendChild(cell);
        }
    }
    scoreDisplay.textContent = score;
}

// Get tile color
function getTileColor(value) {
    const colors = {
        0: '#ccc0b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
    };
    return colors[value] || '#3c3a32';
}

// Check if the game is over
function checkGameOver() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) return false;
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0]
            ];
            for (const [dx, dy] of directions) {
                const nextRow = row + dy;
                const nextCol = col + dx;
                if (
                    nextRow >= 0 &&
                    nextRow < 4 &&
                    nextCol >= 0 &&
                    nextCol < 4 &&
                    grid[row][col] === grid[nextRow][nextCol]
                ) {
                    return false;
                }
            }
        }
    }
    return true;
}
