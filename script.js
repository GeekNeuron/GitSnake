import { updateGame, checkCollision, generateFood } from './js/engine.js';
import { initKeyboardControls, initTouchControls } from './js/controls.js';
import { updateScoreUI, updateBestScoreUI, updateTimerUI, showGameOver, playEatSound, setLevelTitle } from './js/ui.js';
import { spawnPowerUp, drawPowerUp, applyPowerUp, updatePowerUps } from './js/powerups.js';
import { spawnParticles, updateParticles } from './js/particles.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20;

// Elements
const scoreElem = document.getElementById('score');
const bestElem = document.getElementById('bestScore');
const bestValueElem = document.getElementById('bestScoreValue');
const gameOverElem = document.getElementById('gameOver');
const finalScoreElem = document.getElementById('finalScore');
const timeElem = document.getElementById('time');
const powerupHud = document.getElementById('powerups');

// State
const state = {
  dx: 0, dy: 1,
  score: 0,
  speed: 400,
  snake: [{ x: 10, y: 10 }],
  food: {},
  canChangeDirection: true,
  gameRunning: false,
  startTime: 0,
  paused: false,
  animationId: null,
  currentPowerUp: null,
  canvasSize: 400,
};

function updateCanvasSize() {
  state.canvasSize += 20;
  canvas.width = canvas.height = state.canvasSize;
  state.tileCount = Math.floor(state.canvasSize / tileSize);
  ctx.imageSmoothingEnabled = false;
}

function updateDir(x, y) {
  state.dx = x;
  state.dy = y;
}

function togglePause() {
  state.paused = !state.paused;
  if (!state.paused) requestAnimationFrame(gameLoop);
}

function restartGame() {
  Object.assign(state, {
    dx: 0, dy: 1,
    score: 0,
    speed: 400,
    snake: [{ x: 10, y: 10 }],
    food: generateFood(state.tileCount, []),
    gameRunning: true,
    startTime: Date.now(),
    paused: false,
    currentPowerUp: null,
    canvasSize: 400,
  });
  canvas.width = canvas.height = state.canvasSize;
  state.tileCount = Math.floor(state.canvasSize / tileSize);
  bestElem.style.display = 'none';
  gameOverElem.style.display = 'none';
  requestAnimationFrame(gameLoop);
}

function draw() {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const seg of state.snake) {
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize - 1, tileSize - 1);
  }

  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(
    state.food.x * tileSize + tileSize / 2,
    state.food.y * tileSize + tileSize / 2,
    tileSize / 2 - 2, 0, 2 * Math.PI);
  ctx.fill();

  drawPowerUp(ctx, state.currentPowerUp, tileSize);
  updateParticles(ctx, tileSize);
}

function gameLoop() {
  if (!state.gameRunning || state.paused) return;

  const result = updateGame(state.snake, state.dx, state.dy, state.food, { GRID_SIZE: tileSize });
  state.snake = result.snake;

  if (result.ate) {
    state.score += 10;
    state.food = generateFood(state.tileCount, state.snake);
    spawnParticles(state.snake[0].x, state.snake[0].y);
    playEatSound();
    updateScoreUI(scoreElem, state.score);
    updateBestScoreUI(bestElem, bestValueElem, state.score);
    state.speed = Math.max(100, state.speed - 10);
    const level = Math.floor((400 - state.speed) / 25) + 1;
    setLevelTitle(level);
    if (state.score % 100 === 0) updateCanvasSize();
  }

  if (state.currentPowerUp && state.snake[0].x === state.currentPowerUp.x && state.snake[0].y === state.currentPowerUp.y) {
    applyPowerUp(state, state.currentPowerUp);
    state.currentPowerUp = null;
    powerupHud.style.display = 'block';
  }

  updatePowerUps(state, (pu) => state.currentPowerUp = pu);

  if (checkCollision(state.snake, state.tileCount)) {
    state.gameRunning = false;
    showGameOver(state.score, gameOverElem, finalScoreElem);
    return;
  }

  draw();
  updateTimerUI(timeElem, state.startTime);
  state.canChangeDirection = true;
  state.animationId = setTimeout(() => requestAnimationFrame(gameLoop), state.speed);
}

window.addEventListener('load', () => {
  updateCanvasSize();
  initKeyboardControls(state, updateDir, togglePause, restartGame);
  initTouchControls(canvas, state, updateDir, restartGame);
  restartGame();
});
