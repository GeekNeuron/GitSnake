document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gameTitle = document.getElementById('game-title');
    const body = document.body;

    // --- Game Configuration ---
    const gridSize = 20; // Each square is a "contribution" block
    const tileCount = canvas.width / gridSize;

    // --- Game State ---
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let dx = 0; // Velocity x
    let dy = 0; // Velocity y
    let score = 0;
    let changingDirection = false;
    let gameActive = true;

    // --- Theme Management ---
    const themes = {
        dark: {
            snake: '#26a641',
            food: '#39d353',
            text: '#c9d1d9'
        },
        light: {
            snake: '#26a641',
            food: '#006d32',
            text: '#24292f'
        }
    };
    let currentTheme = 'dark';

    gameTitle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    });

    // --- Main Game Loop ---
    function gameLoop() {
        if (!gameActive) {
            displayGameOver();
            return;
        }

        changingDirection = false;
        setTimeout(() => {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            drawScore();
            gameLoop();
        }, 120); // Game speed
    }

    // --- Drawing Functions ---
    function clearCanvas() {
        // The background color is handled by CSS, we just need to clear the rect
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        ctx.fillStyle = themes[currentTheme].snake;
        snake.forEach(part => {
            // Rounded rectangles to mimic GitHub contribution blocks
            ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
        });
    }

    function drawFood() {
        ctx.fillStyle = themes[currentTheme].food;
        ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);
    }
    
    function drawScore() {
        ctx.fillStyle = themes[currentTheme].text;
        ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI"';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 10, 20);
    }

    // --- Game Logic Functions ---
    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }

        if (hasCollision()) {
            gameActive = false;
        }
    }

    function hasCollision() {
        const head = snake[0];
        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return true;
        }
        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        // Avoid spawning on the snake
        if (snake.some(part => part.x === food.x && part.y === food.y)) {
            generateFood();
        }
    }
    
    function displayGameOver() {
        ctx.fillStyle = themes[currentTheme].text;
        ctx.font = '40px -apple-system, BlinkMacSystemFont, "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    }

    // --- Input Handling ---
    function handleKeyDown(event) {
        if (changingDirection) return;

        const key = event.key;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        // Start game on first keypress
        if (dx === 0 && dy === 0) {
            changingDirection = true;
        }

        if ((key === "ArrowUp" || key.toLowerCase() === "w") && !goingDown) { dx = 0; dy = -1; }
        else if ((key === "ArrowDown" || key.toLowerCase() === "s") && !goingUp) { dx = 0; dy = 1; }
        else if ((key === "ArrowLeft" || key.toLowerCase() === "a") && !goingRight) { dx = -1; dy = 0; }
        else if ((key === "ArrowRight" || key.toLowerCase() === "d") && !goingLeft) { dx = 1; dy = 0; }
    }

    // --- Initialize ---
    document.addEventListener('keydown', handleKeyDown);
    generateFood();
    gameLoop();
});
