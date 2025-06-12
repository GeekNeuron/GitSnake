window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gameTitle = document.getElementById('game-title');
    const body = document.body;

    // --- Game State & Configuration (from Project #1) ---
    let speed = 7; // Frames per second
    let tileCount = 20;
    let tileSize = canvas.width / tileCount;
    let headX = 10;
    let headY = 10;
    const snakeParts = [];
    let tailLength = 2;

    let appleX = 5;
    let appleY = 5;

    let xVelocity = 0;
    let yVelocity = 0;

    let score = 0;

    // --- Theme Switcher ---
    gameTitle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
    });

    // --- Game Loop ---
    function drawGame() {
        changeSnakePosition();
        let result = isGameOver();
        if (result) {
            document.body.removeEventListener('keydown', keyDown); // Stop listening for keys
            return;
        }

        clearScreen();
        checkAppleCollision();
        drawApple();
        drawSnake();
        drawScore();

        setTimeout(drawGame, 1000 / speed);
    }

    // --- Core Game Functions ---
    function isGameOver() {
        let gameOver = false;

        if (yVelocity === 0 && xVelocity === 0) {
            return false; // Game hasn't started
        }

        // Wall collision
        if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
            gameOver = true;
        }

        // Self collision
        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            if (part.x === headX && part.y === headY) {
                gameOver = true;
                break;
            }
        }

        if (gameOver) {
            ctx.fillStyle = "white";
            ctx.font = "50px Verdana";
            ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
        }

        return gameOver;
    }

    function clearScreen() {
        const isLightTheme = body.classList.contains('light-theme');
        // The background of the canvas is different based on theme
        ctx.fillStyle = isLightTheme ? '#f0f0f0' : 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        const isLightTheme = body.classList.contains('light-theme');
        ctx.fillStyle = isLightTheme ? '#28a745' : 'lime';

        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
        }

        snakeParts.push({ x: headX, y: headY }); // Put an item at the end of the list next to the head
        if (snakeParts.length > tailLength) {
            snakeParts.shift(); // Remove the furthet item from the snake parts if we have more than our tail size.
        }

        // Snake head color is different
        ctx.fillStyle = isLightTheme ? '#218838' : 'orange';
        ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
    }

    function changeSnakePosition() {
        headX = headX + xVelocity;
        headY = headY + yVelocity;
    }

    function drawApple() {
        const isLightTheme = body.classList.contains('light-theme');
        ctx.fillStyle = isLightTheme ? '#dc3545' : "red";
        ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
    }

    function checkAppleCollision() {
        if (appleX === headX && appleY == headY) {
            appleX = Math.floor(Math.random() * tileCount);
            appleY = Math.floor(Math.random() * tileCount);
            tailLength++;
            score++;
        }
    }

    function drawScore() {
        const isLightTheme = body.classList.contains('light-theme');
        ctx.fillStyle = isLightTheme ? '#333' : "white";
        ctx.font = "12px Verdana";
        ctx.fillText("Score " + score, canvas.width - 60, 20);
    }

    // --- Input Handling ---
    function keyDown(event) {
        // Up
        if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
            if (yVelocity == 1) return; // Prevent moving into self
            yVelocity = -1;
            xVelocity = 0;
        }
        // Down
        if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
            if (yVelocity == -1) return;
            yVelocity = 1;
            xVelocity = 0;
        }
        // Left
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
            if (xVelocity == 1) return;
            yVelocity = 0;
            xVelocity = -1;
        }
        // Right
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
            if (xVelocity == -1) return;
            yVelocity = 0;
            xVelocity = 1;
        }
    }

    document.body.addEventListener('keydown', keyDown);

    // --- Start the game ---
    drawGame();
};
