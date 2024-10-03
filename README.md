# TUIJS-Element
## A small web component framework for building JavaScript UIs.
***TUIJS-Element is built on ES Modules.***

***Last Updated 10/03/2024***

## Rendering
- The general idea is prevent the first render from occurring until all of the initial observed attributes are accounted for. This will allow the creation of custom elements that have non-standard HTML attributes, which can be used for any desired purpose. ***You cannot currently add standard HTML attributes. This capability will be added in a future patch.***

## Event Listeners
- TUIJS-Element has built in methods to handle event listeners. In order for the event listeners to be removed automatically with the 'disconnectedCallback' method, the custom event listener methods must be used.
- Only the 'addTrackedEvent' method is required, as 'removedAllTrackedEvents' will be run during the 'disconnectedCallback', but the other methods are available for manual manipulation if desired.
These methods are listed below. 

```js
addTrackedEvent(element, eventType, callback);
removeTrackedEvent(element, eventType, callback);
removedAllTrackedEvents();
```

## Example Project Code
***The 'elmCleaner' and 'parseTemplate' functions are utility functions provided by tuijs-util***
index.js
```js
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
```
