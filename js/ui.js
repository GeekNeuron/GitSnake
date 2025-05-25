export function updateScoreUI(scoreElem, score) {
  if (scoreElem) scoreElem.textContent = score;
}

export function updateBestScoreUI(bestElem, bestValueElem, score) {
  const best = parseInt(localStorage.getItem('gitsnake-best-score') || '0');
  if (score > best) {
    localStorage.setItem('gitsnake-best-score', score);
    setTimeout(() => alert('🎉 New Best Score! 🎉'), 200);
  }
  if (bestElem && bestValueElem) {
    bestElem.style.display = 'block';
    bestValueElem.textContent = Math.max(score, best);
  }
}

export function updateTimerUI(timeElem, startTime) {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  if (timeElem) timeElem.textContent = elapsed;
}

export function showGameOver(score, gameOverElem, finalScoreElem) {
  if (finalScoreElem) finalScoreElem.textContent = score;
  if (gameOverElem) gameOverElem.style.display = 'block';
  const sound = document.getElementById('gameOverSound');
  if (sound) sound.play();
}

export function playEatSound() {
  const sound = document.getElementById('eatSound');
  if (sound) sound.play();
}

export function setLevelTitle(level) {
  document.title = `GitSnake - Level ${level}`;
  const display = document.getElementById('levelDisplay');
  if (display) display.textContent = level;
}
