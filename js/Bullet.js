class Bullet {
    constructor(props) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.dy = BULLET_SPEED;
        this.initElement();
    }

    initElement() {
        let bulletElem = document.createElement('div');
        bulletElem.className = 'bullet';
        this.element = bulletElem;
    }

    render() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    update() {
        this.y -= this.dy;
        this.element.style.top = this.y + 'px';
    }
}