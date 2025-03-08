const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playAgainButton = document.getElementById('playAgainButton');
const goBackButton = document.getElementById('goBackButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

// Game variables
const playerWidth = 85;
const playerHeight = 70; // Adjusted for bucket image
const objectSize = 50; // Size of food images
let playerX = (canvas.width - playerWidth) / 2; // Player starts in the middle
let objects = []; // Array to store falling objects
let score = 0;
let lives = 3;
let gameOver = false;
let gameLoopId;
let moveLeft = false;
let moveRight = false;
const playerSpeed = 5; // Increased speed for smoother movement

// Load images
const bucketImage = new Image();
bucketImage.src = './assets/basket.png'; // Replace with your bucket image path

const foodImages = [
  './assets/2.png',
  './assets/3.png',
  './assets/4.png',
  './assets/5.png',
  './assets/6.png',
].map((src) => {
  const img = new Image();
  img.src = src; // Replace with your food image paths
  return img;
});

// Player object
const player = {
  x: playerX,
  y: canvas.height - playerHeight - 10,
  width: playerWidth,
  height: playerHeight,
};

// Falling object class
class FallingObject {
  constructor(x, y, size, image, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;
    this.speed = speed;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
  }

  update() {
    this.y += this.speed; // Move object downward
  }
}

// Draw player
function drawPlayer() {
  ctx.drawImage(bucketImage, player.x, player.y, player.width, player.height);
}

// Draw all falling objects
function drawObjects() {
  objects.forEach((object) => object.draw());
}

// Update all falling objects
function updateObjects() {
  objects.forEach((object) => {
    object.update();

    // Check for collision with player
    if (
      object.y + object.size > player.y &&
      object.x > player.x &&
      object.x < player.x + player.width
    ) {
      score++;
      objects.splice(objects.indexOf(object), 1); // Remove caught object
    }

    // Check if object missed
    if (object.y + object.size > canvas.height) {
      lives--;
      objects.splice(objects.indexOf(object), 1); // Remove missed object
    }
  });

  // Game over condition
  if (lives <= 0) {
    gameOver = true;
  }
}

// Spawn new falling objects
function spawnObject() {
  const x = Math.random() * (canvas.width - objectSize);
  const y = 0;
  const image = foodImages[Math.floor(Math.random() * foodImages.length)]; // Random food image
  const speed = 2 + Math.random() * 3; // Random speed
  objects.push(new FallingObject(x, y, objectSize, image, speed));
}

// Draw score and lives
function drawHUD() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 30);
}

// Reset game state
function resetGame() {
  player.x = (canvas.width - playerWidth) / 2;
  objects = [];
  score = 0;
  lives = 3;
  gameOver = false;
  playAgainButton.style.display = 'block';
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
  }
  gameLoop();
}

// Game loop
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
    playAgainButton.style.display = 'block';
    return;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw game elements
  drawPlayer();
  drawObjects();
  drawHUD();

  // Update game state
  updateObjects();

  // Spawn new objects randomly
  if (Math.random() < 0.02) {
    spawnObject();
  }

  // Move player
  if (moveLeft && player.x > 0) {
    player.x -= playerSpeed;
  }
  if (moveRight && player.x + player.width < canvas.width) {
    player.x += playerSpeed;
  }

  // Continue the game loop
  gameLoopId = requestAnimationFrame(gameLoop);
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    moveLeft = true;
  } else if (e.key === 'ArrowRight') {
    moveRight = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') {
    moveLeft = false;
  } else if (e.key === 'ArrowRight') {
    moveRight = false;
  }
});

// Handle mobile controls
leftButton.addEventListener('mousedown', () => (moveLeft = true));
leftButton.addEventListener('mouseup', () => (moveLeft = false));
leftButton.addEventListener('touchstart', () => (moveLeft = true));
leftButton.addEventListener('touchend', () => (moveLeft = false));

rightButton.addEventListener('mousedown', () => (moveRight = true));
rightButton.addEventListener('mouseup', () => (moveRight = false));
rightButton.addEventListener('touchstart', () => (moveRight = true));
rightButton.addEventListener('touchend', () => (moveRight = false));

// Handle Play Again button click
playAgainButton.addEventListener('click', resetGame);

// Handle Go Back to Calendar button click
goBackButton.addEventListener('click', () => {
  window.location.href = 'calendar.html'; // Replace with your calendar page URL
});

// Start the game
resetGame();