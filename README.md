# TUIJS-Element
## A small web component framework for building JavaScript UIs.
***TUIJS-Element is built on ES Modules.***

***Last Updated 10/15/2024***

## Rendering
- The general idea is to use an attribute counter to prevent the first render from occurring until all of the initial observed custom attributes are accounted for. This will allow the creation of custom elements that have non-standard HTML attributes, which can be used for any desired purpose. So if you have created an element with three custom attributes, the element will only render after the 'attributeChangedCallback' method has been called three times for each initial attribute.
- The element will re-render for every change after the first render.
***TUIJS-Element only supports the following default HTML attributes being attached to a custom element.***
- id
- name
- class

# DO NOT OBSERVE DEFAULT HTML ELEMENTS! IT WILL CAUSE A LOOP THAT WILL CRASH YOUR BROWSER!


## Programmatic Changes After Render
- To change the element after the first render, you must do so in a way that will trigger the 'attributeChangedCallback'. This means that you will need to use 'setAttribute' to change the attribute value.
This WILL work.
```js
element.setAttribute('custom-attribute', 'value');
```
This WILL NOT work.
```js
element['custom-attribute'] = 'value';
```

## Event Listeners
- TUIJS-Element has methods to handle event listeners. In order for the event listeners to be removed automatically with the 'disconnectedCallback' or 'attributeChangedCallback' methods, the 'addTrackedEvent' methods must be used.
- The 'removeTrackedEvent' and 'removeAllTrackedEvents' methods are also available for manual manipulation if needed.

```js
addTrackedEvent(element, eventType, callback);
removeTrackedEvent(element, eventType, callback);
removeAllTrackedEvents();
```

## Example Project Code
Demo Location: https://github.com/TechTB-OpenSource/tuijs-element
***The 'parseTemplate' function is a utility functions provided in tuijs-util.***
```js
import { parseTemplate } from 'tuijs-util';
import { TuiElement } from 'tuijs-element';

let elm = parseTemplate(`
        <template>
            <color-box id="color-box-2" color-1="red" color-2="green"></color-box>
        <template>
    `);
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
```
