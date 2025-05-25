const particles = [];

export function spawnParticles(x, y, count = 10, color = '#4ecdc4') {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      alpha: 1,
      color
    });
  }
}

export function updateParticles(ctx, tileSize) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.dx;
    p.y += p.dy;
    p.alpha -= 0.02;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    } else {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x * tileSize + tileSize / 2, p.y * tileSize + tileSize / 2, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}
