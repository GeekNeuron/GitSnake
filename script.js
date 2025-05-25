// Game configuration
const CONFIG = {
    GRID_SIZE: 20,
    INITIAL_SPEED: 300, // Fixed initial speed (slower start)
    MIN_SPEED: 100,
    SPEED_INCREMENT: 5, // Speed decreases by 5 each food
    POINTS_PER_FOOD: 10,
    CORNER_RADIUS: 4
};

// Game elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const bestScoreValueElement = document.getElementById('bestScoreValue');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const pauseOverlay = document.getElementById('pauseOverlay');
const timeElement = document.getElementById('time');

// Game state
const tileCount = canvas.width / CONFIG.GRID_SIZE;
let snake = [{x: 10, y: 10}];
let food = {};
let dx = 0;
let dy = 1; // Start moving down
let score = 0;
let gameRunning = false;
let gameSpeed = CONFIG.INITIAL_SPEED;
let animationId;
let startTime = 0;
let elapsedTime = 0;
let paused = false;

// Initialize game
function initGame() {
    loadBestScore();
    generateFood();
    drawGame();
    canvas.focus();
}

// Helper function for rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

// Generate random food position
function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (isPositionOnSnake(food.x, food.y));
}

// Check if position is occupied by snake
function isPositionOnSnake(x, y) {
    return snake.some(segment => segment.x === x && segment.y === y);
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw subtle grid
    drawGrid();
    // Draw snake
    drawSnake();
    // Draw food with animation
    drawFood();
}

// Draw grid lines
function drawGrid() {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * CONFIG.GRID_SIZE, 0);
        ctx.lineTo(i * CONFIG.GRID_SIZE, canvas.height);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * CONFIG.GRID_SIZE);
        ctx.lineTo(canvas.width, i * CONFIG.GRID_SIZE);
        ctx.stroke();
    }
}

// Draw snake with gradient and details
function drawSnake() {
    snake.forEach((segment, index) => {
        const x = segment.x * CONFIG.GRID_SIZE;
        const y = segment.y * CONFIG.GRID_SIZE;
        if (index === 0) {
            drawSnakeHead(x, y);
        } else {
            drawSnakeBody(x, y, index);
        }
    });
}

// Draw snake head with rounded corners and eyes
function drawSnakeHead(x, y) {
    ctx.fillStyle = '#45b7b8';
    roundRect(ctx, x + 1, y + 1, CONFIG.GRID_SIZE - 2, CONFIG.GRID_SIZE - 2, CONFIG.CORNER_RADIUS);
    // Eyes
    ctx.fillStyle = 'white';
    const eyeSize = 3;
    const eyeOffset = 4;
    if (dx === 1) { // Right
        ctx.fillRect(x + CONFIG.GRID_SIZE - 8, y + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(x + CONFIG.GRID_SIZE - 8, y + CONFIG.GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (dx === -1) { // Left
        ctx.fillRect(x + 5, y + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(x + 5, y + CONFIG.GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (dy === -1) { // Up
        ctx.fillRect(x + eyeOffset, y + 5, eyeSize, eyeSize);
        ctx.fillRect(x + CONFIG.GRID_SIZE - eyeOffset - eyeSize, y + 5, eyeSize, eyeSize);
    } else if (dy === 1) { // Down
        ctx.fillRect(x + eyeOffset, y + CONFIG.GRID_SIZE - 8, eyeSize, eyeSize);
        ctx.fillRect(x + CONFIG.GRID_SIZE - eyeOffset - eyeSize, y + CONFIG.GRID_SIZE - 8, eyeSize, eyeSize);
    } else {
        // Default eyes
        ctx.fillRect(x + 6, y + 5, eyeSize, eyeSize);
        ctx.fillRect(x + CONFIG.GRID_SIZE - 9, y + 5, eyeSize, eyeSize);
    }
}

// Draw snake body with rounded corners and gradient
function drawSnakeBody(x, y, index) {
    const opacity = Math.max(0.6, 1 - (index * 0.05));
    ctx.fillStyle = `rgba(78, 205, 196, ${opacity})`;
    roundRect(ctx, x + 1, y + 1, CONFIG.GRID_SIZE - 2, CONFIG.GRID_SIZE - 2, CONFIG.CORNER_RADIUS);
    // Inner highlight
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
    roundRect(ctx, x + 2, y + 2, CONFIG.GRID_SIZE - 4, CONFIG.GRID_SIZE - 4, CONFIG.CORNER_RADIUS);
}

// Draw animated food
function drawFood() {
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time) * 0.15 + 0.85;
    const rotation = time * 0.5;
    const centerX = food.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
    const centerY = food.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.scale(pulse, pulse);
    // Food body
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(0, 0, CONFIG.GRID_SIZE / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    // Food highlight
    ctx.fillStyle = '#ff9999';
    ctx.beginPath();
    ctx.arc(-2, -2, CONFIG.GRID_SIZE / 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
}

// Update game logic
function updateGame() {
    if (!gameRunning || paused) return;
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Self collision
    if (isPositionOnSnake(head.x, head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score += CONFIG.POINTS_PER_FOOD;
        updateScore();
        generateFood();
        increaseSpeed();
    } else {
        snake.pop();
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
    const bestScore = getBestScore();
    if (score > bestScore) {
        setBestScore(score);
        updateBestScoreDisplay();
    }
}

// Increase game speed
function increaseSpeed() {
    gameSpeed = Math.max(CONFIG.MIN_SPEED, gameSpeed - CONFIG.SPEED_INCREMENT);
}

// Handle game over
function gameOver() {
    gameRunning = false;
    clearTimeout(animationId);
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
    const bestScore = getBestScore();
    if (score > bestScore) {
        setBestScore(score);
        setTimeout(() => {
            alert('🎉 New Best Score! 🎉');
        }, 500);
    }
}

// Restart game
function restartGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 1;
    score = 0;
    gameSpeed = CONFIG.INITIAL_SPEED;
    scoreElement.textContent = score;
    bestScoreElement.style.display = 'none';
    gameOverElement.style.display = 'none';
    pauseOverlay.style.display = 'none';
    generateFood();
    drawGame();
    gameRunning = true;
    startTime = Date.now();
    animationId = requestAnimationFrame(gameLoop);
    elapsedTime = 0;
    updateBestScoreDisplay();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    updateGame();
    drawGame();
    animationId = requestAnimationFrame(gameLoop);
    updateTimer();
}

// Timer functionality
function startTimer() {
    startTime = Date.now();
}

function updateTimer() {
    if (gameRunning && !paused) {
        elapsedTime = (Date.now() - startTime) / 1000;
        timeElement.textContent = Math.floor(elapsedTime);
    }
}

// Pause functionality
function togglePause() {
    paused = !paused;
    if (paused) {
        pauseOverlay.style.display = 'flex';
    } else {
        pauseOverlay.style.display = 'none';
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    if (!gameRunning && e.code !== 'Space') return;
    if (e.code === 'Space') {
        if (gameRunning) {
            togglePause();
        } else {
            restartGame();
        }
        return;
    }
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
const minSwipeDistance = 20;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!gameRunning) {
        if (snake.length === 1) {
            restartGame();
        }
        return;
    }
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) < minSwipeDistance && Math.abs(diffY) < minSwipeDistance) {
        return;
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > minSwipeDistance && dx !== 1) {
            dx = -1;
            dy = 0;
        } else if (diffX < -minSwipeDistance && dx !== -1) {
            dx = 1;
            dy = 0;
        }
    } else {
        if (diffY > minSwipeDistance && dy !== 1) {
            dx = 0;
            dy = -1;
        } else if (diffY < -minSwipeDistance && dy !== -1) {
            dx = 0;
            dy = 1;
        }
    }
}, { passive: false });

// Best score management
function getBestScore() {
    try {
        return parseInt(localStorage.getItem('gitsnake-best-score')) || 0;
    } catch (e) {
        return 0;
    }
}

function setBestScore(score) {
    localStorage.setItem('gitsnake-best-score', score.toString());
}

function loadBestScore() {
    const bestScore = getBestScore();
    if (bestScore > 0) {
        bestScoreElement.style.display = 'block';
        bestScoreValueElement.textContent = bestScore;
    }
}

function updateBestScoreDisplay() {
    const bestScore = getBestScore();
    if (bestScore > 0) {
        bestScoreElement.style.display = 'block';
        bestScoreValueElement.textContent = bestScore;
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    initGame();
});

// Handle tab visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameRunning) {
        paused = true;
        pauseOverlay.style.display = 'flex';
    } else if (!document.hidden && gameRunning && !paused) {
        animationId = requestAnimationFrame(gameLoop);
    }
});
