import { TuiElement } from 'tuijs-element';

/**
 * Takes an HTML template literal, parses it with the DOM parser, then extracts the element with querySelectorAll.
 */
function elmCleaner(templateLit) {
    try {
        let parser = new DOMParser();
        let elmBody = parser.parseFromString(templateLit, 'text/html');
        let elms = elmBody.body.querySelectorAll("*");
        return elms[0];
    } catch (er) {
        console.error(er);
        throw new Error(er);
    }
}

/**
 * Parses template literal with 'template' tag
 */
function parseTemplate(templateLit) {
    try {
        let parser = new DOMParser();
        let doc = parser.parseFromString(templateLit, 'text/html');
        let template = doc.querySelector('template');
        if (!template) {
            throw new Error('No template tag found in the provided string.');
        }
        return template.content;
    } catch (er) {
        console.error(er);
        throw new Error(er);
    }
}

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
