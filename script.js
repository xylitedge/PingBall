const basket = document.getElementById('basket');
const scoreboard = document.getElementById('score');
const gameOverDiv = document.getElementById('game-over');
const groundHitCountDisplay = document.getElementById('ground-hit-count');
const restartButton = document.getElementById('restart');
const gameContainer = document.getElementById('game-container');

// Configurations
let basketX = window.innerWidth / 2 - 50;
let groundHitCounts = [0, 0]; // Track ground hits for each ball
let maxGroundHits = 5;
let score = 0;
let gameOver = false;

// Ball properties
let balls = [];
let numBalls = 2; // Fixed to 2 balls
let ballSize = 30;

function createBall() {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.width = `${ballSize}px`;
    ball.style.height = `${ballSize}px`;
    ball.style.left = `${Math.random() * (window.innerWidth - ballSize)}px`;
    ball.style.top = '0px';
    ball.velocityX = Math.random() < 0.5 ? -3 : 3; // Random horizontal direction
    ball.velocityY = 5;
    gameContainer.appendChild(ball);
    balls.push(ball);
}

// Sound effects
const bounceSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
const groundHitSound = new Audio('https://www.soundjay.com/button/beep-10.wav');
const gameOverSound = new Audio('https://www.soundjay.com/button/beep-09.wav');

// Move basket with mouse
document.addEventListener('mousemove', (event) => {
    if (!gameOver) {
        basketX = Math.max(0, Math.min(event.clientX - 50, window.innerWidth - 100));
        basket.style.left = `${basketX}px`;
    }
});

// Start the game
function startGame() {
    gameOver = false;
    groundHitCounts = [0, 0]; // Reset ground hits
    score = 0;
    scoreboard.textContent = score;
    gameOverDiv.classList.add('hidden');
    updateGroundHitDisplay();

    // Clear previous balls
    balls.forEach(ball => ball.remove());
    balls = [];

    // Create exactly 2 balls
    for (let i = 0; i < numBalls; i++) {
        createBall();
    }

    requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    balls.forEach((ball, index) => {
        // Move ball
        ball.style.left = `${parseFloat(ball.style.left) + ball.velocityX}px`;
        ball.style.top = `${parseFloat(ball.style.top) + ball.velocityY}px`;

        // Bounce off walls
        if (parseFloat(ball.style.left) <= 0 || parseFloat(ball.style.left) >= window.innerWidth - ballSize) {
            ball.velocityX *= -1;
            playSound(bounceSound);
        }

        // Bounce off basket
        if (parseFloat(ball.style.top) >= window.innerHeight - 70 && Math.abs(parseFloat(ball.style.left) - basketX) < 100) {
            ball.velocityY *= -1;
            ball.style.top = `${window.innerHeight - 70}px`;
            score++;
            scoreboard.textContent = score;
            playSound(bounceSound);
        }

        // Bounce off ground
        if (parseFloat(ball.style.top) >= window.innerHeight - ballSize) {
            ball.velocityY *= -1;
            ball.style.top = `${window.innerHeight - ballSize}px`;

            // Increment ground hits
            groundHitCounts[index]++;
            playSound(groundHitSound);
            updateGroundHitDisplay();

            if (groundHitCounts[index] > maxGroundHits) {
                endGame();
                return;
            }
        }
    });

    requestAnimationFrame(gameLoop);
}

// Update ground hit count display
function updateGroundHitDisplay() {
    groundHitCountDisplay.textContent = `Ground Hits: Ball 1: ${groundHitCounts[0]}, Ball 2: ${groundHitCounts[1]}`;
}

// End the game
function endGame() {
    gameOver = true;
    playSound(gameOverSound);
    gameOverDiv.classList.remove('hidden');
}

// Restart game
restartButton.addEventListener('click', startGame);

// Play sound effect
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Start the game on load
startGame();
