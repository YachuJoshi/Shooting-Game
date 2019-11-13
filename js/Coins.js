class Coin {
    constructor(props) {
        this.x = props.x;
        this.y = props.y;
        this.dy = SPEED;
        this.initElement();
    }

    initElement() {
        let coinElem = document.createElement('div');
        coinElem.className = 'coins';
        this.element = coinElem;
    }

    render() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    update() {
        this.y += this.dy;
        this.element.style.top = this.y + 'px';
    }
}