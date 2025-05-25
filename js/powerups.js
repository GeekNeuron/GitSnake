export function spawnPowerUp(tileCount, snake) {
  let type = Math.random() < 0.5 ? 'speed' : 'score';
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some(seg => seg.x === position.x && seg.y === position.y));
  return { ...position, type, ttl: 5000 };
}

export function drawPowerUp(ctx, powerUp, size) {
  if (!powerUp) return;
  ctx.save();
  ctx.translate(powerUp.x * size + size / 2, powerUp.y * size + size / 2);
  ctx.rotate(Date.now() / 200);
  ctx.fillStyle = powerUp.type === 'speed' ? '#FFD700' : '#7CFC00';
  ctx.beginPath();
  ctx.arc(0, 0, size / 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function applyPowerUp(state, powerUp) {
  if (!powerUp) return;
  if (powerUp.type === 'speed') {
    state.speed = Math.max(50, state.speed - 50);
  } else if (powerUp.type === 'score') {
    state.score += 50;
  }
}

export function updatePowerUps(state, setPowerUp) {
  if (!state.currentPowerUp && Date.now() % 8000 < 50) {
    const newPU = spawnPowerUp(state.tileCount, state.snake);
    setPowerUp(newPU);
  }
}
