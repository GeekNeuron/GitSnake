document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gameTitle = document.getElementById('game-title');
    const body = document.body;

    // --- Game Configuration ---
    const gridSize = 20; // Size of each square in the grid
    const tileCount = canvas.width / gridSize;

    // --- Game State ---
    let snake = [{ x: 10, y: 10 }]; // Snake starts in the middle
    let food = {};
    let dx = 0; // Horizontal velocity
    let dy = 0; // Vertical velocity
    let score = 0;
    let changingDirection = false;
    let gameRunning = true;

    // --- Theme Toggler ---
    gameTitle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
    });

    // --- Main Game Functions ---

    /**
     * The main game loop that runs every frame.
     */
    function main() {
        if (!gameRunning) {
            displayGameOver();
            return;
        }

        changingDirection = false;
        setTimeout(() => {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            main();
        }, 100); // Game speed
    }

    /**
     * Clears the canvas for the next frame.
     */
    function clearCanvas() {
        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        ctx.fillStyle = theme === 'dark' ? '#1a1a1a' : '#f0f0f0';
        ctx.strokeStyle = theme === 'dark' ? '#333' : '#ddd';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Draws the snake on the canvas.
     */
    function drawSnake() {
        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        ctx.fillStyle = theme === 'dark' ? '#00e676' : '#28a745'; // Green snake
        ctx.strokeStyle = theme === 'dark' ? '#1a1a1a' : '#f0f0f0'; // For snake segment borders
        snake.forEach(part => {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
            ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        });
    }

    /**
     * Moves the snake and checks for collisions.
     */
    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            createFood();
        } else {
            snake.pop();
        }

        // Check for collision with walls or self
        if (hasGameEnded()) {
            gameRunning = false;
        }
    }

    /**
     * Draws the food on the canvas.
     */
    function drawFood() {
        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        ctx.fillStyle = theme === 'dark' ? '#ff4136' : '#dc3545'; // Red food
        ctx.strokeStyle = theme === 'dark' ? '#1a1a1a' : '#f0f0f0';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    /**
     * Generates a new piece of food at a random location.
     */
    function createFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        // Ensure food doesn't spawn on the snake
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) {
                createFood();
            }
        });
    }

    /**
     * Handles keyboard input for controlling the snake.
     */
    function changeDirection(event) {
        if (changingDirection) return;
        changingDirection = true;

        const keyPressed = event.key;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        if ((keyPressed === "ArrowLeft" || keyPressed.toLowerCase() === "a") && !goingRight) {
            dx = -1;
            dy = 0;
        } else if ((keyPressed === "ArrowUp" || keyPressed.toLowerCase() === "w") && !goingDown) {
            dx = 0;
            dy = -1;
        } else if ((keyPressed === "ArrowRight" || keyPressed.toLowerCase() === "d") && !goingLeft) {
            dx = 1;
            dy = 0;
        } else if ((keyPressed === "ArrowDown" || keyPressed.toLowerCase() === "s") && !goingUp) {
            dx = 0;
            dy = 1;
        }
    }

    /**
     * Checks if the game should end (wall or self collision).
     * @returns {boolean} True if the game has ended.
     */
    function hasGameEnded() {
        const head = snake[0];
        // Check for self collision
        for (let i = 4; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        // Check for wall collision
        const hitLeftWall = head.x < 0;
        const hitRightWall = head.x >= tileCount;
        const hitTopWall = head.y < 0;
        const hitBottomWall = head.y >= tileCount;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    /**
     * Displays the "Game Over" message.
     */
    function displayGameOver() {
        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        ctx.fillStyle = theme === 'dark' ? '#f0f0f0' : '#333';
        ctx.font = '50px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    }


    // --- Start the Game ---
    document.addEventListener('keydown', changeDirection);
    createFood();
    main();
});
