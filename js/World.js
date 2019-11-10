class World {
    constructor(props) {
        this.parentElement = props.element;
        this.car = new Car({
            x: TRACK_WIDTH / 2 - BLOCK_WIDTH / 2 ,
            y: TRACK_HEIGHT - BLOCK_HEIGHT
        });
        this.coins = [];
        this.obstacles = [];
        this.healthBars = [];
        this.bullets = [];
        this.distance = 0;
        this.isGameActive = false;
        this.scoreInitElement();
    }

    scoreInitElement() {
        let scoreElem = document.createElement('span');
        scoreElem.className = 'score';
        this.scoreElement = scoreElem;
    }

    render() {
        this.car.render();
        this.obstacles.forEach(obstacle => {
            obstacle.render();
        });
        this.healthBars.forEach(healthBar => {
            healthBar.render();
        });
    }

    gameLoop() {
        this.car.moveX();
        document.addEventListener('keypress', () => {
            if(event.keyCode === 32 || event.which === 32) {
                this.createBullet();
            }
        });

        let id = setInterval(() => {
            console.log(this.healthBars);
            this.updateBackground(); 
            this.checkDistance();
            this.obstacles.forEach(obstacle => {
                this.obstacles = filterNull(this.obstacles);
                obstacle.update();
            });
            this.healthBars.forEach(healthBar => {
                this.healthBars = filterNull(this.healthBars);
                healthBar.update();
            });

            this.checkObstacleCollision();

            this.updateObstacles();
            this.updateBullet();

            if(this.distance >= 6000) {
                alert(`You completed the game. Score: ${this.distance}` );
                this.isGameActive = false;
                clearInterval(id);
            } else if(Math.round(this.car.health) <= 0) {
                alert(`Game Over!`);
                this.isGameActive = false;
                clearInterval(id);
            }
            this.showScore();
        }, 20);
    }

    append() {
        this.parentElement.appendChild(this.car.element);
        this.obstacles.forEach(obstacle => {
            this.parentElement.appendChild(obstacle.element);
        });
        this.healthBars.forEach(healthBar => {
            this.parentElement.appendChild(healthBar.element);
        });
        this.parentElement.appendChild(this.scoreElement);
    }

    createObstacle() {
        for(let i=0; i<POSSIBLE_X.length; i++) {
            let currX = POSSIBLE_X[i];
            if(Math.random() > 0.5) {
                continue;
            }
            this.obstacles.push(new Obstacle({
                x: currX,
                y: 30
            }));
            this.healthBars.push(new HealthBar({
                x: currX - 5,
                y: -15
            }));
        }
    }

    createBullet() {
        let bullet = new Bullet({
            x: this.car.x + BLOCK_WIDTH / 2 - BULLET_SIZE / 2,
            y: this.car.y 
        });
        bullet.render();
        this.parentElement.appendChild(bullet.element);
        this.bullets.push(bullet);
    }

    createExplosion(obs) {
        let explosionElem = document.createElement('div');
        explosionElem.className = 'explosion';
        explosionElem.style.left = obs.x + 'px';
        explosionElem.style.top = obs.y + 'px';
        this.parentElement.appendChild(explosionElem);

        let animationCoutner = 0;
        let animation = setInterval(() => {
            if(animationCoutner >= 1) {
                this.parentElement.removeChild(explosionElem);
                clearInterval(animation);
            }
            animationCoutner++;
        }, 12);
    }

    checkDistance() {
        this.distance += 2;
        if(this.distance % ENEMY_GAP === 0) {
            this.createObstacle();
            this.obstacles.forEach(obstacle => {
                obstacle.render();
                this.parentElement.appendChild(obstacle.element);
            });
            this.healthBars.forEach(healthBar => {
                healthBar.render();
                this.parentElement.appendChild(healthBar.element);
            });
        }
    }

    checkObstacleCollision() {
        for (let i=0; i<this.obstacles.length; i++) {
        let obs = this.obstacles[i];
        let healthBar = this.healthBars[i];
        if (
            obs.x + BLOCK_WIDTH > this.car.x &&
            obs.x < this.car.x + BLOCK_WIDTH &&
            obs.y + BLOCK_HEIGHT > this.car.y &&
            obs.y < BLOCK_HEIGHT + this.car.y
          ){
            obs.decreaseHealth();
            this.car.health -= 0.07;
            if(obs.element.parentNode !== null) {
                this.parentElement.removeChild(obs.element);
            }
            if(checkParentNode(this.parentElement, healthBar.element)) {
                this.parentElement.removeChild(healthBar.element);
            }
            return true;
            }
        }
        return false;
    }

    checkBulletCollision(bullet) {
        for (let i=0; i<this.obstacles.length; i++) {
            let obs = this.obstacles[i];
            if (
                obs.x + BLOCK_WIDTH > bullet.x &&
                obs.x < bullet.x + BULLET_SIZE &&
                obs.y + BLOCK_HEIGHT > bullet.y &&
                obs.y < BULLET_SIZE + bullet.y
              ){
                this.createExplosion(obs);
                return obs;
            }
        }
        return null;
    }
    
    updateBullet() {
        for(let i=0; i<this.bullets.length; i++) {
            let bullet = this.bullets[i];
            bullet.update();
            let strokeObs = this.checkBulletCollision(bullet);
            if(strokeObs) {
                strokeObs.health -= 1;
            }
            if(bullet.y < 0 || strokeObs) {
                this.bullets[i] = null;
                if(checkParentNode(this.parentElement, bullet.element)) {
                    this.parentElement.removeChild(bullet.element);
                }
            }
        }
        this.bullets = filterNull(this.bullets);
    }

    updateObstacles() {
        for(let i=0; i<this.obstacles.length; i++) {
            let obstacle = this.obstacles[i];
            let healthBar = this.healthBars[i];
            if(obstacle.y >= TRACK_HEIGHT - 30 || obstacle.health <= 0) {
                this.obstacles[i] = null;
                this.healthBars[i] = null;
                if(checkParentNode(this.parentElement, obstacle.element)) {
                    this.parentElement.removeChild(obstacle.element);
                }
                if(checkParentNode(this.parentElement, healthBar.element)) {
                    this.parentElement.removeChild(healthBar.element);
                }
            }
        }
        this.obstacles = filterNull(this.obstacles);
        this.healthBars = filterNull(this.healthBars);
    }

    updateBackground() {
        this.parentElement.style.backgroundPosition = '0px ' + this.distance + 'px';
    }

    showScore() {
        this.scoreElement.textContent = "SCORE: " + this.distance;
    }

    init() {
        this.isGameActive = true;
        this.createObstacle();
        this.gameLoop();
        this.append();
        this.render();
    }
}

const game = new World({
    element: document.querySelector('.race-track')
});

game.init();