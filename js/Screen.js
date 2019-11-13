class Screen {
    constructor(props) {
        this.screenName = props.screenName;
        this.initElement();
    }

    initElement() {
        let screenElem = document.createElement('div');
        screenElem.className = this.screenName;
        this.element = screenElem;
    }

    display() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
}