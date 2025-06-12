document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  // Adjust canvas size
  const canvasSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.7);
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  // Game variables
  let snake = [{ x: 10, y: 10 }];
  let food = {};
  let score = 0;
  let direction = 'right';
  let changingDirection = false;
  let gameEnded = false;

  function createFood() {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    // Ensure food doesn't spawn on the snake
    snake.forEach(part => {
      if (part.x === food.x && part.y === food.y) {
        createFood();
      }
    });
  }

  function main() {
    if (gameEnded) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px sans-serif';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
        return;
    }
    
    changingDirection = false;
    setTimeout(() => {
      clearCanvas();
      drawFood();
      moveSnake();
      drawSnake();
      main();
    }, 100);
  }

  function clearCanvas() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDarkMode ? '#333' : '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawSnake() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--snake-color').trim();
    snake.forEach(part => {
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
  }

  function drawFood() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--food-color').trim();
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  }

  function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    snake.unshift(head);

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
      score++;
      createFood();
    } else {
      snake.pop();
    }
    
    checkCollision();
  }
  
  function checkCollision() {
    const head = snake[0];
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameEnded = true;
    }
    // Self collision
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameEnded = true;
        }
    }
  }

  function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.key;
    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingLeft = direction === 'left';
    const goingRight = direction === 'right';

    if (keyPressed === 'ArrowUp' && !goingDown) direction = 'up';
    if (keyPressed === 'ArrowDown' && !goingUp) direction = 'down';
    if (keyPressed === 'ArrowLeft' && !goingRight) direction = 'left';
    if (keyPressed === 'ArrowRight' && !goingLeft) direction = 'right';
  }
  
  // Theme Switcher Logic
  const themeSwitcher = document.getElementById('theme-switcher');
  
  function applyTheme(theme) {
      if (theme === 'dark') {
          document.body.classList.add('dark-mode');
      } else {
          document.body.classList.remove('dark-mode');
      }
  }

  themeSwitcher.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    clearCanvas(); // Redraw canvas with new background
    drawFood();
    drawSnake();
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);


  // Event Listeners
  document.addEventListener('keydown', changeDirection);

  // Start the game
  createFood();
  main();
});
