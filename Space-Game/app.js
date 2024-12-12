class GameObject {
    constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false; // 객체가 파괴되었는지 여부
    this.type = ""; // 객체 타입 (영웅/적)
    this.width = 0; // 객체의 폭
    this.height = 0; // 객체의 높이
    this.img = undefined; // 객체의 이미지
    }

    rectFromGameObject() {
        return {
        top: this.y,
        left: this.x,
        bottom: this.y + this.height,
        right: this.x + this.width,
        };
    }

    draw(ctx) {
    //캔버스에 이미지 그리기
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); //
    }
}

class BossEnemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 200;
        this.height = 150;
        this.type = "BossEnemy";
        this.health = 20; // 보스의 체력
        this.img = bossImg;
        let id = setInterval(() => {
            if (!this.dead) {
                this.x += Math.random() > 0.5 ? 5 : -5; // 좌우로 움직임
                this.y += Math.random() > 0.5 ? 5 : -5; // 상하로 움직임

                // 화면 경계 체크
                this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height / 2, this.y)); // 화면 상단 절반까지만 이동
            } else {
                clearInterval(id);
            }
        }, 300);
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.dead = true;
            eventEmitter.emit(Messages.BOSS_DEFEATED);
        }
    }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 99), (this.height = 75);
        this.type = "Hero";
        this.speed = { x: 0, y: 0 };
        this.cooldown = 0;
        this.life = 3;
        this.points = 0;
    }
    decrementLife() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;
        }
    }

    incrementPoints() {
        this.points += 100;
    }

    fire() {
        if (this.canFire()) {
            gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 발사
            this.cooldown = 500; // 쿨다운 500ms
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id);//쿨다운 완료 후 타이머 종료
                }
            }, 100);
        }
    }
    canFire() {
        return this.cooldown === 0; // 쿨다운이 끝났는지 확인
    }
}

class Boss extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 200;
        this.height = 100;
        this.type = "Boss";
        this.hp = 100;
        this.img = bossImg;

        setInterval(() => {
            if (!this.dead) {
                gameObjects.push(new Laser(this.x + this.width / 2, this.y + this.height));
            }
        }, 1000);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.dead = true;
        }
    }
}

class SideHero extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 40), (this.height = 35);
        this.type = "SideHero";
        this.speed = { x: 0, y: 0 };
        this.cooldown = 0;
    }

    fire() {
        if (this.canFire()) {
            gameObjects.push(new Laser(this.x + 15 , this.y - 10)); // 레이저 발사
            this.cooldown = 1000; // 쿨다운 1000ms
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id);//쿨다운 완료 후 타이머 종료
                }
            }, 100);
        }
    }
    canFire() {
        return this.cooldown === 0; // 쿨다운이 끝났는지 확인
    }
}
class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 9), (this.height = 33);
        this.type = 'Laser';
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15; // 레이저가 위로 이동
            } else {
                this.dead = true; // 화면 상단에 도달하면 제거
                clearInterval(id);
            }
        }, 100);
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
        // 적 캐릭터의 자동 이동 (Y축 방향)
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5; // 아래로 이동
            } else {
                console.log('Stopped at', this.y);
                clearInterval(id); // 화면 끝에 도달하면 정지
            }
        }, 300);
    }
}

class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
    if (!this.listeners[message]) {
        this.listeners[message] = [];
    }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
    if (this.listeners[message]) {
        this.listeners[message].forEach((l) => l(message, payload));
        }
    }
    clear() {
        this.listeners = {};
    }


}

function createHero() {
    hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
    );
    sideHero1 = new SideHero(
        canvas.width / 2 - 100,
        canvas.height - canvas.height / 5
    );
    sideHero2 = new SideHero(
        canvas.width / 2 + 70,
        canvas.height - canvas.height / 5
    );

    hero.img = heroImg;
    sideHero1.img = heroImg;
    sideHero2.img = heroImg;

    gameObjects.push(hero);
    gameObjects.push(sideHero1);
    gameObjects.push(sideHero2);
}

function createEnemies() {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;

    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

function createBoss() {
    const boss = new Boss(canvas.width / 2 - 100, 50);
    gameObjects.push(boss);
}

function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    })
}

function createBossEnemy() {
    const boss = new BossEnemy(canvas.width / 2 - 100, 50); // 화면 중앙 상단에 생성
    gameObjects.push(boss);
}

function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();

    // 보조 우주선 자동 공격 시작
    const sideHeroes = [sideHero1, sideHero2];
    startAutoAttack(sideHeroes, 500);

    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= 5,
        sideHero1.y -= 5,
        sideHero2.y -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 5,
        sideHero1.y += 5,
        sideHero2.y += 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 5,
        sideHero1.x -= 5,
        sideHero2.x -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 5,
        sideHero1.x += 5,
        sideHero2.x += 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.dead = true;
        if (second.type === "BossEnemy") {
            second.takeDamage();
        } else {
            second.dead = true;
            hero.incrementPoints();
        }

        if (isEnemiesDead() && !isBossStage()) {
            startBossStage();
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        if (enemy.type === "BossEnemy") {
            eventEmitter.emit(Messages.GAME_END_LOSS);
        } else {
            enemy.dead = true;
            hero.decrementLife();

            if (isHeroDead()) {
                eventEmitter.emit(Messages.GAME_END_LOSS);
                return; // loss before victory
            }

            if (isEnemiesDead() && !isBossStage()) {
                startBossStage();
            }
        }
    });

    eventEmitter.on(Messages.BOSS_DEFEATED, () => {
        endGame(true);
    });

    eventEmitter.on(Messages.GAME_END_WIN, () => {
        endGame(true);
    });

    eventEmitter.on(Messages.GAME_END_LOSS, () => {
        endGame(false);
    });

    eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
        resetGame();
    });
}


function isBossStage() {
    return gameObjects.some((go) => go.type === "BossEnemy" && !go.dead);
}

function startBossStage() {
    gameObjects = gameObjects.filter((go) => go.type !== "Enemy" || go.dead); // 일반 적 제거
    createBossEnemy();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    updateGameObjects();
    drawHUD();

    if (stage === 1 && isEnemiesDead()) {
        stage = 2;
        createBoss();
    }

    if (stage === 2 && isBossDead()) {
        endGame(true);
    }
}

function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}

function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser");

    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: l,
                    second: m,
                });
            }
        });
    });

    gameObjects = gameObjects.filter((go) => !go.dead);
}

function intersectRect(r1, r2) {
    return !(
        r2.left > r1.right || // r2가 r1의 오른쪽에 있음
        r2.right < r1.left || // r2가 r1의 왼쪽에 있음
        r2.top > r1.bottom || // r2가 r1의 아래에 있음
        r2.bottom < r1.top // r2가 r1의 위에 있음
    );
   }

function drawHUD() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Stage: ${stage}`, 10, 20);
    ctx.fillText(`Lives: ${hero.life}`, 10, 50);
    ctx.fillText(`Points: ${hero.points}`, 10, 80);
}

function isEnemiesDead() {
    return gameObjects.filter(go => go.type === "Enemy" && !go.dead).length === 0;
}

function isBossDead() {
    return gameObjects.filter(go => go.type === "Boss" && !go.dead).length === 0;
}

function endGame(win) {
    clearInterval(gameLoopId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Arial";
    ctx.fillStyle = win ? "green" : "red";
    ctx.textAlign = "center";
    ctx.fillText(win ? "You Win!" : "Game Over", canvas.width / 2, canvas.height / 2);
}

const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_END_WIN: "GAME_END_WIN",
    BOSS_DEFEATED: "BOSS_DEFEATED",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};



let canvas, ctx, gameLoopId;
let gameObjects = [];
let hero, stage;
let heroImg, enemyImg, bossImg, laserImg;

window.onload = async () => {
    const backImg = await loadTexture('assets/starBackground.png');
    destroyedEnemie = await loadTexture('assets/laserGreenShot.png');
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    heroImg = await loadTexture("assets/player.png");
    enemyImg = await loadTexture("assets/enemyShip.png");
    laserImg = await loadTexture("assets/laserRed.png");
    lifeImg = await loadTexture("assets/life.png");
    bossImg = await loadTexture("assets/enemyUFO.png");

    initGame();

    gameLoopId = setInterval(() => {
        const bgPattern = ctx.createPattern(backImg, 'repeat');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = bgPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGameObjects(ctx);
        updateGameObjects();
        drawPoints();
        drawLife();
    }, 100);

    let onKeyDown = function (e) {
        console.log(e.keyCode);
        switch (e.keyCode) {
            case 37: // 왼쪽 화살표
            case 39: // 오른쪽 화살표
            case 38: // 위쪽 화살표
            case 40: // 아래쪽 화살표
            case 32: // 스페이스바
                e.preventDefault();
                break;
            default:
                break;
        }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener("keyup", (evt) => {
        if (evt.key === "ArrowUp") {
            eventEmitter.emit(Messages.KEY_EVENT_UP);
        } else if (evt.key === "ArrowDown") {
            eventEmitter.emit(Messages.KEY_EVENT_DOWN);
        } else if (evt.key === "ArrowLeft") {
            eventEmitter.emit(Messages.KEY_EVENT_LEFT);
        } else if (evt.key === "ArrowRight") {
            eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
        } else if (evt.keyCode === 32) {
            eventEmitter.emit(Messages.KEY_EVENT_SPACE);
        } else if (evt.key === "Enter") {
            eventEmitter.emit(Messages.KEY_EVENT_ENTER);
        }
    });
};
