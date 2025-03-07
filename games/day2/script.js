const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playAgainButton = document.getElementById('playAgain');

// Load images
const birdImg = new Image();
birdImg.src = 'assets/images/bird.png';

const pipeImg = new Image();
pipeImg.src = 'assets/images/pipe.png';

const bgImg = new Image();
bgImg.src = 'assets/images/background.png';

// Game variables
let bird = { x: 50, y: 150, width: 40, height: 30 };
let gravity = 0.6;
let lift = -10;
let velocity = 0;
let pipes = [];
let frame = 0;
let gameOver = false;
let score = 0;

// Draw bird
function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Update bird position
function updateBird() {
  velocity += gravity;
  bird.y += velocity;

  // Check for collision with ground or sky
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

// Draw pipes
function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
    ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

// Update pipes
function updatePipes() {
  if (frame % 90 === 0) {
    const gap = 180;
    const top = Math.random() * (canvas.height - gap);
    pipes.push({ x: canvas.width, width: 40, top: top, bottom: canvas.height - top - gap });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Check for collision with bird
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }

    // Increment score if bird passes a pipe
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// Draw score
function drawScore() {
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Reset game state
function resetGame() {
  bird = { x: 50, y: 150, width: 40, height: 30 };
  velocity = 0;
  pipes = [];
  frame = 0;
  gameOver = false;
  score = 0;
  playAgainButton.style.display = 'none'; // Hide the button
  gameLoop(); // Restart the game loop
}

// Game loop
function gameLoop() {
  if (gameOver) {
    playAgainButton.style.display = 'block'; // Show the button
    return;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Draw and update game elements
  drawBird();
  drawPipes();
  updateBird();
  updatePipes();
  drawScore();

  frame++;
  requestAnimationFrame(gameLoop);
}

// Handle user input (keyboard and touch)
function handleInput() {
  if (!gameOver) {
    velocity = lift;
  }
}

// Add event listeners for keyboard and touch
document.addEventListener('keydown', handleInput);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent default touch behavior
  handleInput();
});

// Handle Play Again button click
playAgainButton.addEventListener('click', resetGame);

// Start the game
gameLoop();