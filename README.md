# TUIJS
## A small web component framework for building JavaScript UIs.
***TUIJS is built on modules. A bundler is recommended.***

***Last Updated 08/29/2024***

## Notes
The general idea is prevent re-rendering of an element every time an attribute change is observed. This will allow developers to create custom element classes which have attribute observes that can be added to a JS project as template literals with custom attributes included.

## Example Class
***The 'parseTemplate' function is a util provided by tuijs-util***
comp.js
```js
import { parseTemplate } from 'tuijs-util';
import { TuiElement } from 'tuijs';

export class ColorBox extends TuiElement {
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
```

## Example Project Code
***The 'elmCleaner' function is a util provided by tuijs-util***
index.js
```js
import { elmCleaner } from 'tuijs-util';
import { ColorBox } from './comp.js';

let elm = elmCleaner(`<color-box color-1="red" color-2="green"></color-box>`);
document.body.appendChild(elm);
```
