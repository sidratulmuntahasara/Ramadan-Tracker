const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const winnerMessage = document.getElementById('winnerMessage');
const winnerText = document.getElementById('winnerText');

let currentPlayer = 'X'; // Player is X, computer is O
let gameState = ['', '', '', '', '', '', '', '', ''];
const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

// Function to handle cell clicks
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute('data-index');

  // Check if the cell is empty and the game is still active
  if (gameState[index] !== '') return;

  // Player's move
  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);

  // Check if the player wins
  if (checkWin(currentPlayer)) {
    showWinnerMessage(`${currentPlayer} wins!`);
    return;
  }

  // Check for a draw
  if (gameState.every(cell => cell !== '')) {
    showWinnerMessage('Draw!');
    return;
  }

  // Switch to the computer's turn
  currentPlayer = 'O';
  setTimeout(computerMove, 500); // Delay for a better user experience
}

// Function for the computer's move
function computerMove() {
  let availableCells = gameState
    .map((value, index) => (value === '' ? index : null))
    .filter(index => index !== null);

  if (availableCells.length > 0) {
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameState[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';
    cells[randomIndex].classList.add('O');

    // Check if the computer wins
    if (checkWin('O')) {
      showWinnerMessage('O wins!');
      return;
    }

    // Check for a draw
    if (gameState.every(cell => cell !== '')) {
      showWinnerMessage('Draw!');
      return;
    }

    // Switch back to the player's turn
    currentPlayer = 'X';
  }
}

// Function to check for a win
function checkWin(player) {
  return winningConditions.some(condition => {
    return condition.every(index => {
      return gameState[index] === player;
    });
  });
}

// Function to show the winner message
function showWinnerMessage(message) {
  winnerText.textContent = message;
  winnerMessage.classList.add('show');
}

// Function to reset the game
function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });
  currentPlayer = 'X'; // Player starts first
  winnerMessage.classList.remove('show'); // Hide the winner message
}

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);