class Car {
    constructor(props) {
        this.x = props.x;
        this.y = props.y;
        this.health = HEALTH;
        this.speed = SPEED;
        this.initElement();
    }

    initElement() {
        let carElem = document.createElement('div');
        carElem.className = 'car';
        this.element = carElem;
    }

    reset() {
        this.x = INITIAL_X;
        this.y = INITIAL_Y;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    render() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    moveX(gameID, keyCode) {
        if(gameID === 0) {
            if(keyCode === 37) {
                if(this.x >= BLOCK_WIDTH){
                    this.x -= BLOCK_WIDTH;
                    this.render();
                }
            }
            if(keyCode === 39) {
                if(this.x <= BLOCK_WIDTH + 36){
                    this.x += BLOCK_WIDTH;
                    this.render();
                }
            }
        }
    }
}