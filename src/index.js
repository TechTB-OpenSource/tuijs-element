export class TuiElement extends HTMLElement {
    constructor() {
        super();
        this.attributeCount = 0;
        this.renderRequested = false;
        this.rendered = false;
        this.attributeLength = this.attributes.length;
        for (let i = 0; i < this.attributes.length; i++) {
            if (
                this.attributes[i].name === 'id' ||
                this.attributes[i].name === 'name' ||
                this.attributes[i].name === 'title' ||
                this.attributes[i].name === 'href' ||
                this.attributes[i].name === 'value'
            ) {
                this.attributeLength--;
            }
        }
    }
    connectedCallback() {
        if (this.renderRequested === true || this.attributeLength === 0) {
            this.render();
            this.rendered = true;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            if (this.rendered === true) {
                this.render();
                return;
            }
            this.attributeCount++;
            if (this.attributeCount === this.attributeLength) {
                this.renderRequested = true;
                return;
            }
        }
    }
    moveTaggedChildren(newParent, tag) {
        let elms = this.querySelectorAll(`${tag}`);
        for (let i = 0; i < elms.length; i++) {
            newParent.appendChild(elms[i]); // Appends the new parent node
        }
    }
}
