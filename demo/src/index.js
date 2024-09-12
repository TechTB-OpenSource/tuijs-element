import { elmCleaner, parseTemplate } from 'tuijs-util';
import { TuiElement } from 'tuijs';

let elm = elmCleaner(`<color-box color-1="red" color-2="green"></color-box>`);
document.body.appendChild(elm);
class ColorBox extends TuiElement {
    constructor() {
        super();
        this.color1 = this.getAttribute('color-1');
        this.color2 = this.getAttribute('color-2');
    }
    static get observedAttributes() {
        return ['color-1', 'color-2'];
    }
    render() {
        let elmTemplate = /*HTML*/`
            <template>
                <div style="height: 64px;width: 64px;background-color: ${this.color1}">
                    <p style="color: black">Color Box<p>
                <div>
            </template>
        `;
        this.appendChild(parseTemplate(elmTemplate));
        this.addEventListener('click', () => this.handleButtonClick());
        return;
    }
    handleButtonClick() {
        const div = this.querySelector('div');
        div.style.backgroundColor = this.color2;
        return;
    }
}
customElements.define('color-box', ColorBox);