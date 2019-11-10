class Obstacle {
    constructor(props) {
        this.x = props.x;
        this.y = props.y;
        this.dy = SPEED;
        this.health = HEALTH;
        this.initElement();
    }

    initElement() {
        let obsElem = document.createElement('div');
        obsElem.className = 'obstacle';
        this.element = obsElem;
    }

    render() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    update() {
        this.y += this.dy;
        this.element.style.top = this.y + 'px';
    }

    decreaseHealth() {
        this.health -= 0.1;
    }
}