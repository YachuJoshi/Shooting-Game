class World {
    constructor(props) {
        this.parentElement = props.element;
        this.car = new Car({
            x: TRACK_WIDTH / 2 - BLOCK_WIDTH / 2 ,
            y: TRACK_HEIGHT - BLOCK_HEIGHT
        });
        this.obstacles = [];
        this.healthBars = [];
        this.bullets = [];
        this.distance = 0;
        this.onKeyDownMove = this.onKeyDownMove.bind(this);
        this.onKeyPressShoot = this.onKeyPressShoot.bind(this)
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.forBullet = this.forBullet.bind(this);
        this.gameID = this.constructor.increaseCount();
        this.isGameActive = false;
        this.scoreInitElement();
    }

    scoreInitElement() {
        let scoreElem = document.createElement('span');
        scoreElem.className = 'score';
        this.scoreElement = scoreElem;
        let healthElem = document.createElement('span');
        healthElem.className = 'car-health';
        this.healthElement = healthElem;
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

    gameEvent() {
        document.addEventListener('keydown', this.onKeyDownMove);

        document.querySelector('.left-button').addEventListener('click', this.moveLeft);
        document.querySelector('.right-button').addEventListener('click', this.moveRight);

        document.addEventListener('keypress', this.onKeyPressShoot);
        document.querySelector('.shoot-button').addEventListener('click', this.forBullet);
    }

    onKeyDownMove(key) {
        if(this.isGameActive) {
            this.car.moveX(key.keyCode);
        }
    }

    moveLeft() {
        if(this.isGameActive) {
            if(this.car.x >= BLOCK_WIDTH){
                this.car.x -= BLOCK_WIDTH;
                this.car.render();
            }
        }
    }

    moveRight() {
        if(this.isGameActive) {
            if(this.car.x <= BLOCK_WIDTH + 36){
                this.car.x += BLOCK_WIDTH;
                this.car.render();
            }
        }
    }

    onKeyPressShoot(key) {
        if((key.keyCode === 32 || key.which === 32) && this.isGameActive) {
            this.createBullet();
        }
    }

    forBullet() {
        if(this.isGameActive) {
            this.createBullet();
        }
    }

    resetEventHandler() {
        document.removeEventListener('keydown', this.onKeyDownMove);

        document.querySelector('.left-button').removeEventListener('click', this.moveLeft);
        document.querySelector('.right-button').removeEventListener('click', this.moveRight);

        document.removeEventListener('keypress', this.onKeyPressShoot);
        document.querySelector('.shoot-button').removeEventListener('click', this.forBullet);
    }

    gameLoop() {
        let id = setInterval(() => {
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
            if(this.distance >= DISTANCE_LIMIT) {
                this.isGameActive = false;
                clearInterval(id);
                this.parentElement.removeChild(this.healthElement);
                this.parentElement.removeChild(this.scoreElement);
                this.createGameOverScreen('You Completed The Game.', DISTANCE_LIMIT);
            } else if(Math.round(this.car.health) <= 0) {
                this.isGameActive = false;
                clearInterval(id);
                this.parentElement.removeChild(this.healthElement);
                this.parentElement.removeChild(this.scoreElement);
                this.createGameOverScreen('Game Over!', this.distance);
            }
            this.checkObstacleCollision();

            this.updateObstacles();
            this.updateBullet();

            this.showCarHealth();
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
        this.parentElement.appendChild(this.healthElement);
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

    reset() {
        this.car.reset();
        this.distance = 0;
        this.bullets.forEach(bullet => {
            if(checkParentNode(this.parentElement, bullet.element)) {
                this.parentElement.removeChild(bullet.element);
            }
        });
        this.bullets = [];
        this.obstacles.forEach(obs => {
            if(checkParentNode(this.parentElement, obs.element)) {
                this.parentElement.removeChild(obs.element);
            }
        });
        this.obstacles = [];
        this.healthBars.forEach(healthBar => {
            if(checkParentNode(this.parentElement, healthBar.element)) {
                this.parentElement.removeChild(healthBar.element);
            }
        });
        this.healthBars = [];
    }

    createHomeScreen() {
        let homeScreen = new Screen({
            screenName: 'home-screen'
        });
        this.parentElement.appendChild(homeScreen.element);
        let startBtn = document.createElement('button');
        startBtn.className = 'home-screen-start-button';
        homeScreen.element.appendChild(startBtn);
        homeScreen.display();
        startBtn.onclick = () => {
            homeScreen.hide();
            this.reset();
            this.init();
        }
    }

    createGameOverScreen(msg, score) {
        let gameOverScreen = new Screen({
            screenName: 'game-over-screen'
        });
        this.parentElement.appendChild(gameOverScreen.element);
        gameOverScreen.display();
        let gameOverText = document.createElement('div');
        gameOverText.className = "result-screen-game-over";
        gameOverText.innerHTML = `<p> ${msg} </p>`;
        gameOverScreen.element.appendChild(gameOverText);
        gameOverScreen.element.appendChild(document.createElement('hr'));

        let scoreBoard = document.createElement('div');
        scoreBoard.className = 'score-board';
        gameOverScreen.element.appendChild(scoreBoard);
        scoreBoard.textContent = "Final Score: " + this.distance;

        let tryAgainBtn = document.createElement('button');
        tryAgainBtn.className = 'try-again-button';
        tryAgainBtn.textContent = 'Try Again!';
        if(score >= DISTANCE_LIMIT) {
            tryAgainBtn.style.top = 380 + 'px';
        }
        gameOverScreen.element.appendChild(tryAgainBtn);
        gameOverScreen.element.appendChild(document.createElement('hr'));
        tryAgainBtn.onclick = () => {
            gameOverScreen.hide();
            this.resetEventHandler();
            this.createHomeScreen();
        }
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
            let healthBar = this.healthBars[i];
            if (
                obs.x + BLOCK_WIDTH > bullet.x &&
                obs.x < bullet.x + BULLET_SIZE &&
                obs.y + BLOCK_HEIGHT > bullet.y &&
                obs.y < BULLET_SIZE + bullet.y
              ){
                healthBar.element.style.backgroundImage = "url('images/half-hp.png')";
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

    showCarHealth() {
        this.healthElement.textContent = "HEALTH: " + Math.round(this.car.health);
    }

    showScore() {
        this.scoreElement.textContent = "SCORE: " + this.distance;
    }

    static increaseCount() {
        return count++;
    }

    init() {
        this.isGameActive = true;
        this.createObstacle();
        this.gameEvent();
        this.gameLoop();
        this.append();
        this.render();
    }
}

const game = new World({
    element: document.querySelector('.race-track-0')
});

game.createHomeScreen();