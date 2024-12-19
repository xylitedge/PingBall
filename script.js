const basket = document.getElementById('basket');
const scoreboard = document.getElementById('score');
const gameOverDiv = document.getElementById('game-over');
const groundHitCountDisplay = document.getElementById('ground-hit-count');
const restartButton = document.getElementById('restart');
const gameContainer = document.getElementById('game-container');

// Configurations
let basketX = window.innerWidth / 2 - 50;
let groundHitCounts = [0, 0];
let maxGroundHits = 5;
let score = 0;
let gameOver = false;

// Ball properties
let balls = [];
let numBalls = 2;
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

// Add touch support for basket
function handleTouch(event) {
    if (!gameOver) {
        const touchX = event.touches[0].clientX;
        basketX = Math.max(0, Math.min(touchX - 50, window.innerWidth - 100));
        basket.style.left = `${basketX}px`;
    }
}
document.addEventListener('mousemove', (event) => {
    if (!gameOver) {
        basketX = Math.max(0, Math.min(event.clientX - 50, window.innerWidth - 100));
        basket.style.left = `${basketX}px`;
    }
});
document.addEventListener('touchmove', handleTouch);

// Start the game
function startGame() {
    gameOver = false;
    groundHitCounts = [0, 0];
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
        ball.style.left = `${parseFloat(ball.style.left) + ball.velocityX}px`;
        ball.style.top = `${parseFloat(ball.style.top) + ball.velocityY}px`;

        // Bounce off walls
        if (parseFloat(ball.style.left) <= 0 || parseFloat(ball.style.left) >= window.innerWidth - ballSize) {
            ball.velocityX *= -1;
        }

        // Bounce off basket
        if (parseFloat(ball.style.top) >= window.innerHeight - 70 && Math.abs(parseFloat(ball.style.left) - basketX) < 100) {
            ball.velocityY = -7;
            ball.style.transform = 'scale(1.2)'; // Simulate squash
            setTimeout(() => ball.style.transform = 'scale(1)', 100);
            score++;
            scoreboard.textContent = score;
        }

        // Bounce off ground
        if (parseFloat(ball.style.top) >= window.innerHeight - ballSize) {
            ball.velocityY = -5;
            ball.style.top = `${window.innerHeight - ballSize}px`;
            groundHitCounts[index]++;
            updateGroundHitDisplay();

            if (groundHitCounts[index] > maxGroundHits) {
                endGame();
                return;
            }
        }

        // Simulate gravity
        ball.velocityY += 0.2;
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
    gameOverDiv.classList.remove('hidden');
}

// Restart game
restartButton.addEventListener('click', startGame);

// Start the game on load
startGame();


