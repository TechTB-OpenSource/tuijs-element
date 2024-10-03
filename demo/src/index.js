import { elmCleaner, parseTemplate } from 'tuijs-util';
import { TuiElement } from 'tuijs-element';

let elm = elmCleaner(`<color-box color-1="red" color-2="green"></color-box>`);
document.body.appendChild(elm);

class ColorBox extends TuiElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return ['color-1', 'color-2'];
    }
    render() {
        console.log(`RENDER`)
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
                <div class="box" style="background-color: ${this.getAttribute('color-1')};">
                    <p>Color Box<p>
                <div>
            </template>
        `;
        this.appendChild(parseTemplate(elmTemplate));
        super.addTrackedEvent(this, 'click', () => this.handleButtonClick());
        return;
    }
    handleButtonClick() {
        const div = this.querySelector('div');
        if (div.style.backgroundColor === this.getAttribute('color-1')) {
            div.style.backgroundColor = this.getAttribute('color-2');
            return;
        }
        div.style.backgroundColor = this.getAttribute('color-1');
        return;
    }
}
customElements.define('color-box', ColorBox);