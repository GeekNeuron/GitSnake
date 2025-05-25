// Game configuration
const CONFIG = {
    GRID_SIZE: 20,
    INITIAL_SPEED: 150,
    MIN_SPEED: 80,
    SPEED_INCREMENT: 2,
    POINTS_PER_FOOD: 10
};

// Game elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const bestScoreValueElement = document.getElementById('bestScoreValue');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Game state
const tileCount = canvas.width / CONFIG.GRID_SIZE;
let snake = [{x: 10, y: 10}];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let gameSpeed = CONFIG.INITIAL_SPEED;
let gameInterval;
let animationId;

// Initialize game
function initGame() {
    loadBestScore();
    generateFood();
    drawGame();
    showStartMessage();
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
            // Snake head
            drawSnakeHead(x, y);
        } else {
            // Snake body
            drawSnakeBody(x, y, index);
        }
    });
}

// Draw snake head with eyes
function drawSnakeHead(x, y) {
    // Head body
    ctx.fillStyle = '#45b7b8';
    ctx.fillRect(x + 1, y + 1, CONFIG.GRID_SIZE - 2, CONFIG.GRID_SIZE - 2);
    
    // Eyes
    ctx.fillStyle = 'white';
    const eyeSize = 3;
    const eyeOffset = 4;
    
    // Determine eye position based on direction
    if (dx === 1) { // Moving right
        ctx.fillRect(x + CONFIG.GRID_SIZE - 8, y + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(x + CONFIG.GRID_SIZE - 8, y + CONFIG.GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (dx === -1) { // Moving left
        ctx.fillRect(x + 5, y + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(x + 5, y + CONFIG.GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (dy === -1) { // Moving up
        ctx.fillRect(x + eyeOffset, y + 5, eyeSize, eyeSize);
        ctx.fillRect(x + CONFIG.GRID_SIZE - eyeOffset - eyeSize, y + 5, eyeSize, eyeSize);
    } else if (dy === 1) { // Moving down
        ctx.fillRect(x + eyeOffset, y + CONFIG.GRID_SIZE - 8, eyeSize, eyeSize);
        ctx.fillRect(x + CONFIG.GRID_SIZE - eyeOffset - eyeSize, y + CONFIG.GRID_SIZE - 8, eyeSize, eyeSize);
    } else {
        // Default eyes when not moving
        ctx.fillRect(x + 6, y + 5, eyeSize, eyeSize);
        ctx.fillRect(x + CONFIG.GRID_SIZE - 9, y + 5, eyeSize, eyeSize);
    }
}

// Draw snake body with gradient effect
function drawSnakeBody(x, y, index) {
    const opacity = Math.max(0.6, 1 - (index * 0.05));
    ctx.fillStyle = `rgba(78, 205, 196, ${opacity})`;
    ctx.fillRect(x + 1, y + 1, CONFIG.GRID_SIZE - 2, CONFIG.GRID_SIZE - 2);
    
    // Add inner highlight
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
    ctx.fillRect(x + 2, y + 2, CONFIG.GRID_SIZE - 4, CONFIG.GRID_SIZE - 4);
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
    if (!gameRunning) return;

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision
    if (isPositionOnSnake(head.x, head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check food collision
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
    
    // Check for new best score
    const bestScore = getBestScore();
    if (score > bestScore) {
        setBestScore(score);
        updateBestScoreDisplay();
    }
}

// Increase game speed
function increaseSpeed() {
    if (gameSpeed > CONFIG.MIN_SPEED) {
        gameSpeed = Math.max(CONFIG.MIN_SPEED, gameSpeed - CONFIG.SPEED_INCREMENT);
        restartGameLoop();
    }
}

// Restart game loop with new speed
function restartGameLoop() {
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// Main game loop
function gameLoop() {
    updateGame();
    drawGame();
}

// Handle game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
    
    // Save best score
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
    dy = 0;
    score = 0;
    gameSpeed = CONFIG.INITIAL_SPEED;
    
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    
    generateFood();
    drawGame();
    gameRunning = true;
    
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    // Prevent default behavior for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    
    if (!gameRunning && e.code !== 'Space') return;

    switch(e.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (dy !== 1) {
                dx = 0; dy = -1;
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (dy !== -1) {
                dx = 0; dy = 1;
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (dx !== 1) {
                dx = -1; dy = 0;
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (dx !== -1) {
                dx = 1; dy = 0;
            }
            break;
        case 'Space':
            if (!gameRunning && snake.length === 1) {
                restartGame();
            }
            break;
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
const minSwipeDistance = 30;

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
    
    // Check if swipe is long enough
    if (Math.abs(diffX) < minSwipeDistance && Math.abs(diffY) < minSwipeDistance) {
        return;
    }
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && dx !== 1) {
            dx = -1; dy = 0; // Swipe left
        } else if (diffX < 0 && dx !== -1) {
            dx = 1; dy = 0; // Swipe right
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && dy !== 1) {
            dx = 0; dy = -1; // Swipe up
        } else if (diffY < 0 && dy !== -1) {
            dx = 0; dy = 1; // Swipe down
        }
    }
}, { passive: false });

// Best score management
function getBestScore() {
    return parseInt(localStorage.getItem('gitsnake-best-score')) || 0;
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
    bestScoreElement.style.display = 'block';
    bestScoreValueElement.textContent = score;
}

// Show start message
function showStartMessage() {
    setTimeout(() => {
        if (!gameRunning) {
            alert('🐍 Welcome to GitSnake!\n\nPress SPACE to start playing!\nUse arrow keys or WASD to control the snake.');
        }
    }, 1500);
}

// Prevent context menu on canvas
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Initialize game when page loads
window.addEventListener('load', () => {
    initGame();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameRunning) {
        // Pause game when tab is not visible
        clearInterval(gameInterval);
    } else if (!document.hidden && gameRunning) {
        // Resume game when tab becomes visible
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
});
