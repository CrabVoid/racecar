const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const player = {
    x: 400,
    y: 300,
    angle: 0,
    speed: 2
};

const walls = [
    { x: 100, y: 100, width: 600, height: 20 }, // Top wall
    { x: 100, y: 200, width: 20, height: 400 }, // Left wall
    { x: 300, y: 100, width: 20, height: 600 }, // Center wall
    { x: 100, y: 500, width: 600, height: 20 }, // Bottom wall
    { x: 680, y: 200, width: 20, height: 300 }, // Right wall
];

const bullets = [];
const enemies = [
    { x: 500, y: 300, width: 30, height: 30, health: 30 }
];

function drawPlayer() {
    context.save();
    context.translate(player.x, player.y);
    context.rotate(player.angle);
    context.fillStyle = 'red';
    context.fillRect(-10, -10, 20, 20); // Player as a square
    context.restore();
}

function drawWalls() {
    context.fillStyle = 'white';
    walls.forEach(wall => {
        context.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function drawBullets() {
    context.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        context.fillRect(bullet.x, bullet.y, 5, 5);
    });
}

function drawEnemies() {
    context.fillStyle = 'blue';
    enemies.forEach(enemy => {
        context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function castRay(angle) {
    const rayLength = 800;
    const step = 1;
    let x = player.x;
    let y = player.y;

    for (let i = 0; i < rayLength; i += step) {
        x += Math.cos(angle) * step;
        y += Math.sin(angle) * step;

        for (const wall of walls) {
            if (x > wall.x && x < wall.x + wall.width && y > wall.y && y < wall.y + wall.height) {
                return i; // Return distance to wall
            }
        }
    }
    return rayLength; // If no wall is hit
}

function updateEnemies() {
    enemies.forEach(enemy => {
        const angleToPlayer = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angleToPlayer) * 0.5; // Move towards player
        enemy.y += Math.sin(angleToPlayer) * 0.5;

        if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < 20) {
            player.health -= 0.1; // Damage player
        }
    });
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;

        // Check for collisions with walls
        for (const wall of walls) {
            if (bullet.x > wall.x && bullet.x < wall.x + wall.width && bullet.y > wall.y && bullet.y < wall.y + wall.height) {
                bullets.splice(i, 1); // Remove bullet
                break;
            }
        }

        // Check for collisions with enemies
        for (const enemy of enemies) {
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width && bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                enemy.health -= 10; // Damage enemy
                bullets.splice(i, 1); // Remove bullet
                if (enemy.health <= 0) {
                    enemies.splice(enemies.indexOf(enemy), 1); // Remove enemy if health is 0
                }
                break;
            }
        }
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawWalls();
    drawBullets();
    drawEnemies();
    drawPlayer();

    const numberOfRays = 120;
    const rayAngleStep = (Math.PI / 4) / numberOfRays;

    for (let i = 0; i < numberOfRays; i++) {
        const rayAngle = player.angle - Math.PI / 8 + i * rayAngleStep;
        const distanceToWall = castRay(rayAngle);

        const wallHeight = (canvas.height * 100) / distanceToWall;
        const sliceX = (canvas.width / numberOfRays) * i;
        context.fillStyle = 'gray'; // Color of the wall
        context.fillRect(sliceX, (canvas.height - wallHeight) / 2, (canvas.width / numberOfRays), wallHeight);
    }
}

function update() {
    if (keys['w']) {
        player.x += Math.cos(player.angle) * player.speed;
        player.y += Math.sin(player.angle) * player.speed;
    }
    if (keys['s']) {
        player.x -= Math.cos(player.angle) * player.speed;
        player.y -= Math.sin(player.angle) * player.speed;
    }
    if (keys['a']) {
        player.angle -= 0.05; // Rotate left
    }
    if (keys['d']) {
        player.angle += 0.05; // Rotate right
    }

    // Check for collisions with walls
    walls.forEach(wall => {
        if (player.x > wall.x && player.x < wall.x + wall.width && player.y > wall.y && player.y < wall.y + wall.height) {
            player.x = 400;
            player.y = 300;
        }
    });

    updateEnemies();
    updateBullets();
}

const keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

document.addEventListener('click', (event) => {
    const bullet = {
        x: player.x,
        y: player.y,
        angle: player.angle,
        speed: 5
    };
    bullets.push(bullet);
});

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
