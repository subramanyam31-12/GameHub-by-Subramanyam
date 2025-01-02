let currentPlayer = null;
let computerPlayer = null;
let gameActive = false;
const gameState = ['', '', '', '', '', '', '', '', ''];
const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('game-status');
const resetBtn = document.getElementById('resetBtn');
const quitBtn = document.getElementById('quitBtn');
const gameBoard = document.getElementById('game-board');
const playerSelection = document.getElementById('player-selection');
const celebrationMessage = document.getElementById('celebration-message');

// Function to start the game with selected player
const startGame = (player) => {
  currentPlayer = player;
  computerPlayer = player === 'X' ? 'O' : 'X'; // The computer takes the other symbol
  gameActive = true;
  gameState.fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
    cell.style.pointerEvents = 'auto';
  });
  playerSelection.style.display = 'none';
  gameBoard.style.display = 'grid';
  gameStatus.textContent = `${currentPlayer}'s turn`;
  resetBtn.style.display = 'block';
  quitBtn.style.display = 'block';
  celebrationMessage.style.display = 'none'; // Hide celebration message on start
  if (currentPlayer === 'O') { // If the user plays as 'O', computer goes first
    computerMove();
  }
};

// Function to handle a player's move
const handleCellClick = (e) => {
  const cellIndex = Array.from(cells).indexOf(e.target);
  if (gameState[cellIndex] || !gameActive || currentPlayer === 'O') return;

  gameState[cellIndex] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer.toLowerCase());
  e.target.style.pointerEvents = 'none';

  if (checkWinner()) {
    gameActive = false;
    gameStatus.textContent = `${currentPlayer} wins!`;
    showCelebration();
  } else if (gameState.every(cell => cell !== '')) {
    gameActive = false;
    gameStatus.textContent = 'It\'s a draw!';
  } else {
    currentPlayer = computerPlayer;
    gameStatus.textContent = `Computer's turn`;
    setTimeout(computerMove, 500); // Delay computer move for realism
  }
};

// Function to make the computer's move using Minimax algorithm
const computerMove = () => {
  const bestMove = findBestMove();
  if (bestMove !== null) {
    gameState[bestMove] = computerPlayer;
    cells[bestMove].textContent = computerPlayer;
    cells[bestMove].classList.add(computerPlayer.toLowerCase());
    cells[bestMove].style.pointerEvents = 'none';

    if (checkWinner()) {
      gameActive = false;
      gameStatus.textContent = `Computer wins!`;
      showCelebration();
    } else if (gameState.every(cell => cell !== '')) {
      gameActive = false;
      gameStatus.textContent = 'It\'s a draw!';
    } else {
      currentPlayer = 'X';
      gameStatus.textContent = `${currentPlayer}'s turn`;
    }
  }
};

// Function to find the best move for the computer using Minimax
const findBestMove = () => {
  let bestValue = -Infinity;
  let bestMove = null;

  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === '') {
      gameState[i] = computerPlayer;
      const moveValue = minimax(gameState, 0, false);
      gameState[i] = '';
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

// Minimax algorithm
const minimax = (state, depth, isMaximizing) => {
  const winner = evaluateWinner(state);
  if (winner !== null) {
    return winner === computerPlayer ? 10 - depth : winner === currentPlayer ? depth - 10 : 0;
  }

  if (state.every(cell => cell !== '')) {
    return 0; // Draw
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < state.length; i++) {
      if (state[i] === '') {
        state[i] = computerPlayer;
        const eval = minimax(state, depth + 1, false);
        state[i] = '';
        maxEval = Math.max(maxEval, eval);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < state.length; i++) {
      if (state[i] === '') {
        state[i] = currentPlayer;
        const eval = minimax(state, depth + 1, true);
        state[i] = '';
        minEval = Math.min(minEval, eval);
      }
    }
    return minEval;
  }
};

// Function to evaluate winner for Minimax
const evaluateWinner = (state) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const [a, b, c] of winningCombinations) {
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a]; // Return 'X' or 'O' as the winner
    }
  }
  return null; // No winner yet
};

// Function to check for a winner
const checkWinner = () => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      cells[a].classList.add('win-animation');
      cells[b].classList.add('win-animation');
      cells[c].classList.add('win-animation');
      return true;
    }
    return false;
  });
};

// Function to show the celebration animation
const showCelebration = () => {
  // Displaying balloons effect (confetti)
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    document.body.appendChild(confetti);
    setTimeout(() => {
      confetti.remove();
    }, 2000); // Remove after 2 seconds
  }

  // Displaying celebratory message with custom text
  celebrationMessage.textContent = `🎉 Congratulations ${currentPlayer}! 🎉`;
  celebrationMessage.style.display = 'block';
};

// Function to restart the game
const restartGame = () => {
  playerSelection.style.display = 'flex';
  gameBoard.style.display = 'none';
  gameStatus.textContent = '';
  resetBtn.style.display = 'none';
  quitBtn.style.display = 'none';
};

// Function to quit the game
const quitGame = () => {
  window.location.reload(); // Reload the page to quit and reset
};

// Event listeners
document.getElementById('playerX').addEventListener('click', () => startGame('X'));
document.getElementById('playerO').addEventListener('click', () => startGame('O'));
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', restartGame);
quitBtn.addEventListener('click', quitGame);


