const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Player
let player = {
  x: 400,
  y: 300,
  size: 15,
  speed: 4,
  energy: 0,
  health: 5
};

let keys = {};

// Orbs & Enemies
let orbs = [];
let enemies = [];

// Controls
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Distance
function distance(a, b) {
  return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
}

// Game Loop
function update() {
  // Movement
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  // Spawn orbs
  if (Math.random() < 0.02) {
    orbs.push({x: Math.random()*800, y: Math.random()*600});
  }

  // Spawn enemies
  if (Math.random() < 0.01) {
    enemies.push({x: Math.random()*800, y: Math.random()*600});
  }

  // Collect orbs
  orbs = orbs.filter(orb => {
    if (distance(player, orb) < 20) {
      player.energy++;
      return false;
    }
    return true;
  });

  // Move enemies
  enemies.forEach(enemy => {
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let dist = Math.sqrt(dx*dx + dy*dy);

    enemy.x += dx / dist * 2;
    enemy.y += dy / dist * 2;

    if (distance(player, enemy) < 20) {
      player.health--;
      enemy.x = Math.random()*800;
      enemy.y = Math.random()*600;
    }
  });

  // Clean pollution (SPACE)
  if (keys[" "]) {
    enemies = enemies.filter(enemy => {
      if (distance(player, enemy) < 80 && player.energy > 0) {
        player.energy--;
        return false;
      }
      return true;
    });
  }
}

// Draw
function draw() {
  ctx.fillStyle = "#0f2e1c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "lime";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI*2);
  ctx.fill();

  // Orbs
  ctx.fillStyle = "yellow";
  orbs.forEach(o => {
    ctx.beginPath();
    ctx.arc(o.x, o.y, 8, 0, Math.PI*2);
    ctx.fill();
  });

  // Enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, 12, 0, Math.PI*2);
    ctx.fill();
  });

  // UI
  ctx.fillStyle = "white";
  ctx.fillText("Energy: " + player.energy, 20, 30);
  ctx.fillText("Health: " + player.health, 20, 50);

  if (player.health <= 0) {
    ctx.fillText("GAME OVER", 350, 300);
  }
}

// Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();