export class TuiElement extends HTMLElement {
    constructor() {
        super();
        this.attributeCount = 0;
        this.renderRequested = false;
        this.rendered = false;
        this.attributeLength = this.attributes.length;
    }
    connectedCallback() {
        /**
         * If render requested is equal to true, or the attribute length is observed to be 0
         * call the render method and marked the rendered status as true
         */
        if (this.renderRequested === true || this.attributeLength === 0) {
            this.render();
            this.rendered = true;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            /**
             * If the rendered status is true
             * Re-render the element, ignoring non-rerender attributes
             */
            if (this.rendered === true) {
                // If the shadow root is used, render on the shadow root context and not the this context
                if (this.shadowRoot) {
                    this.shadowRoot.replaceChildren(); // This clears the element in prep for rerender - DO NOT REMOVE
                    this.render();
                    return;
                }
                this.replaceChildren(); // This clears the element in prep for rerender - DO NOT REMOVE
                this.render();
                return;
            }
            /**
             * If the element has not already been rendered
             * Add 1 to the attribute count
             * If the attribute count matches the attribute length, marker render requested as true
             */
            this.attributeCount++;
            if (this.attributeCount === this.attributeLength) {
                this.renderRequested = true;
                return;
            }
        }
    }
    moveTaggedChildren(newParent, tag) {
        let elms = this.querySelectorAll(`${tag}`);
        let fragment = document.createDocumentFragment();

        elms.forEach(elm => {
            fragment.appendChild(elm); // Append to fragment
        });

        newParent.appendChild(fragment); // Append all at once to reduce reflows
    }
    moveTaggedChildrenOLD(newParent, tag) {
        let elms = this.querySelectorAll(`${tag}`);
        for (let i = 0; i < elms.length; i++) {
            newParent.appendChild(elms[i]); // Appends the new parent node
        }
    }
    deleteChildrenExceptTagged(tag) {
        const children = Array.from(this.children);
        for (let i = 0; i < children.length; i++) {
            if (children[i].tagName.toLowerCase() !== tag.toLowerCase()) {
                children[i].remove();
            }
        }
    }
    deleteChildrenNodeList(nodeList) {
        nodeList.forEach(node => {
            node.remove();
        });
    }
    checkDefaultAttributes(value) {
        for (let i = 0; i < this.defaultAttributes.length; i++) {
            if (this.defaultAttributes[i] === value) {
                return true;
            }
        }
        return false;
    }
}
