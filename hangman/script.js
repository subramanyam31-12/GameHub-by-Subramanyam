const wordsList = [
  { word: "elephant", category: "Animals" },
  { word: "mango", category: "Fruits" },
  { word: "tiger", category: "Animals" },
  { word: "javascript", category: "Programming Languages" }
];

let currentWordData = {};
let guessedWord = [];
let incorrectGuesses = 0;
const maxIncorrectGuesses = 6;

// DOM Elements
const wordContainer = document.getElementById("word");
const categoryContainer = document.getElementById("category");
const lettersContainer = document.getElementById("letters");
const incorrectCount = document.getElementById("incorrect-count");
const hangmanImage = document.getElementById("hangman-image");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

// Start New Game
function startNewGame() {
  currentWordData = getRandomWord();
  guessedWord = Array(currentWordData.word.length).fill("_");
  incorrectGuesses = 0;

  categoryContainer.textContent = `Category: ${currentWordData.category}`;
  incorrectCount.textContent = incorrectGuesses;
  hangmanImage.src = "hangman-0.png";
  popup.classList.add("hidden");

  renderWord();
  renderLetters();
}

function getRandomWord() {
  return wordsList[Math.floor(Math.random() * wordsList.length)];
}

function renderWord() {
  wordContainer.textContent = guessedWord.join(" ");
}

function renderLetters() {
  lettersContainer.innerHTML = "";
  for (let charCode = 65; charCode <= 90; charCode++) {
    const letter = String.fromCharCode(charCode);
    const button = document.createElement("button");
    button.textContent = letter;
    button.className = "letter";
    button.addEventListener("click", () => handleGuess(letter, button));
    lettersContainer.appendChild(button);
  }
}

function handleGuess(letter, button) {
  button.disabled = true;
  const word = currentWordData.word.toUpperCase();
  let correctGuess = false;

  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      guessedWord[i] = currentWordData.word[i];
      correctGuess = true;
    }
  }

  if (!correctGuess) {
    incorrectGuesses++;
    incorrectCount.textContent = incorrectGuesses;
    hangmanImage.src = `hangman-${incorrectGuesses}.png`;
  }

  renderWord();
  checkGameStatus();
}

function checkGameStatus() {
  if (!guessedWord.includes("_")) {
    popupMessage.textContent = "Congratulations! You Won!";
    popup.classList.remove("hidden");
  } else if (incorrectGuesses >= maxIncorrectGuesses) {
    popupMessage.textContent = `Game Over! The word was "${currentWordData.word}".`;
    popup.classList.remove("hidden");
  }
}

function quitGame() {
  popupMessage.textContent = "Thanks for playing!";
  popup.classList.remove("hidden");
  lettersContainer.innerHTML = "";
  wordContainer.textContent = "";
  categoryContainer.textContent = "";
  hangmanImage.src = "hangman-0.png";
}

// Start the Game
startNewGame();
