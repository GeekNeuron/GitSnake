export function initKeyboardControls(state, updateDir, togglePause, restartGame) {
  document.addEventListener('keydown', (e) => {
    if (!state.canChangeDirection) return;
    state.canChangeDirection = false;
    const code = e.code;

    if (['ArrowUp', 'KeyW'].includes(code) && state.dy !== 1) updateDir(0, -1);
    if (['ArrowDown', 'KeyS'].includes(code) && state.dy !== -1) updateDir(0, 1);
    if (['ArrowLeft', 'KeyA'].includes(code) && state.dx !== 1) updateDir(-1, 0);
    if (['ArrowRight', 'KeyD'].includes(code) && state.dx !== -1) updateDir(1, 0);
    if (code === 'Space') {
      if (state.gameRunning) togglePause();
      else restartGame();
    }
  });
}

export function initTouchControls(canvas, state, updateDir, restartGame) {
  let startX = 0, startY = 0;
  canvas.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', e => {
    if (!state.canChangeDirection) return;
    state.canChangeDirection = false;
    if (!state.gameRunning) return restartGame();

    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && state.dx !== -1) updateDir(1, 0);
      else if (dx < -20 && state.dx !== 1) updateDir(-1, 0);
    } else {
      if (dy > 20 && state.dy !== -1) updateDir(0, 1);
      else if (dy < -20 && state.dy !== 1) updateDir(0, -1);
    }
  }, { passive: true });
}
