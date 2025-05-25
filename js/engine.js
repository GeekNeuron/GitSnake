export function updateGame(snake, dx, dy, food, config) {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const ate = head.x === food.x && head.y === food.y;
  if (!ate) snake.pop();
  return { snake, ate };
}

export function checkCollision(snake, tileCount) {
  const [head, ...body] = snake;
  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    body.some(seg => seg.x === head.x && seg.y === head.y)
  ) return true;
  return false;
}

export function generateFood(tileCount, snake) {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
  return newFood;
}
