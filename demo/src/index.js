import { elmCleaner, parseTemplate } from 'tuijs-util';
import { TuiElement } from 'tuijs-element';

let elm = elmCleaner(`<color-box color-1="red" color-2="green"></color-box>`);
elm.innerText = 'Color Box 2';
document.body.appendChild(elm);

class ColorBox extends TuiElement {
    constructor() {
        super();
        this.text = this.innerHTML;
    }
    static get observedAttributes() {
        return ['color-1', 'color-2'];
    }
    render() {
        console.log(`RENDER`);
        let elmTemplate = /*HTML*/`
            <template>
                <style>
                    .box {
                        height: 128px;
                        width: 128px;
                        margin: 32px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .box p {
                        text-align: center;
                        color: black;
                    }
                </style>
                <p>${this.text}</p>
            </template>
        `;
        this.classList.add('box');
        this.style.backgroundColor = `${this.getAttribute('color-1')}`;
        this.innerText = '';
        this.appendChild(parseTemplate(elmTemplate));
        super.addTrackedEvent(this, 'click', () => this.handleButtonClick());
        return;
    }
    handleButtonClick() {
        if (this.style.backgroundColor === this.getAttribute('color-1')) {
            this.style.backgroundColor = this.getAttribute('color-2');
            return;
        }
        this.style.backgroundColor = this.getAttribute('color-1');
        return;
    }
}
customElements.define('color-box', ColorBox);