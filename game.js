// Space Shooter Game for Portfolio
// Player: Guitar shooting musical notes at enemies (notes and chords)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
  lives: 3,
};

let bullets = [];
let enemies = [];
let isPaused = false;
let score = 0;
let enemySpeedMultiplier = 0.8; // Slow enemies by 20%
let boss = null;
let bossSpawned = false;
let bossBullets = [];

// Load guitar image
const guitarImage = new Image();
guitarImage.src = 'guitar.png';

// Load enemy images (notes and chords)
const noteImage = new Image();
noteImage.src = 'note.png';
const chordImage = new Image();
chordImage.src = 'chord.png';

// Player movement
window.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    player.dx = -player.speed;
  }
  if (e.key === 'ArrowRight') {
    player.dx = player.speed;
  }
  if (e.key === ' ') {
    shootBullet();
  }
  if (e.key === 'p') {
    isPaused = !isPaused;
  }
});

window.addEventListener('keyup', function (e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    player.dx = 0;
  }
});

// Shooting bullets
function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 7,
  });
}

// Create enemies
function createEnemy() {
  if (bossSpawned) return;

  const type = Math.random() > 0.5 ? 'note' : 'chord';
  enemies.push({
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    speed: 2 * enemySpeedMultiplier,
    type: type,
    hits: type === 'chord' ? 2 : 1,
  });
}

// Create boss
function createBoss() {
  boss = {
    x: canvas.width / 2 - 75,
    y: 50,
    width: 100,
    height: 100,
    hits: 6,
  };
  bossSpawned = true;
}

// Boss shooting
function bossShoot() {
  if (boss) {
    bossBullets.push({
      x: boss.x + boss.width / 2 - 5,
      y: boss.y + boss.height,
      width: 10,
      height: 20,
      speed: 5,
    });
  }
}

// Update game state
function update() {
  if (isPaused) return;

  // Move player
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

  // Move bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // Move enemies
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
      player.lives -= 1;
      if (player.lives <= 0) {
        resetGame();
      }
    }
  });

  // Move boss bullets
  bossBullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;
    if (bullet.y > canvas.height) {
      bossBullets.splice(index, 1);
    }
  });

  // Check for collisions
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.hits -= 1;
        bullets.splice(bulletIndex, 1);
        if (enemy.hits <= 0) {
          enemies.splice(enemyIndex, 1);
          score += 20;

          // Increase speed every 4 enemies
          if ((score / 20) % 4 === 0) {
            enemySpeedMultiplier *= 1.05;
          }

          // Spawn boss after 25 enemies
          if (score / 20 === 25 && !bossSpawned) {
            createBoss();
          }
        }
      }
    });
  });

  // Check for boss collision
  if (boss) {
    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < boss.x + boss.width &&
        bullet.x + bullet.width > boss.x &&
        bullet.y < boss.y + boss.height &&
        bullet.y + bullet.height > boss.y
      ) {
        boss.hits -= 1;
        bullets.splice(bulletIndex, 1);
        if (boss.hits <= 0) {
          boss = null;
          bossSpawned = false;
          score += 100;
        }
      }
    });

    // Check for boss bullets hitting player
    bossBullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y
      ) {
        bossBullets.splice(bulletIndex, 1);
        player.lives -= 1;
        if (player.lives <= 0) {
          resetGame();
        }
      }
    });
  }
}

// Draw game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.drawImage(guitarImage, player.x, player.y, player.width, player.height);

  // Draw bullets
  bullets.forEach((bullet) => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw enemies
  enemies.forEach((enemy) => {
    if (enemy.type === 'note') {
      ctx.drawImage(noteImage, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      ctx.drawImage(chordImage, enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });

  // Draw boss
  if (boss) {
    ctx.fillStyle = 'red';
    ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
  }

  // Draw boss bullets
  bossBullets.forEach((bullet) => {
    ctx.fillStyle = 'purple';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw scoreboard
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
  ctx.fillText('Lives: ' + player.lives, canvas.width - 100, 30);
}

// Reset game
function resetGame() {
  player.lives = 3;
  score = 0;
  enemySpeedMultiplier = 0.8;
  enemies = [];
  bullets = [];
  boss = null;
  bossSpawned = false;
  bossBullets = [];
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
setInterval(createEnemy, 2000);
setInterval(bossShoot, 2000);
gameLoop();
