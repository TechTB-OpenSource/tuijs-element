export class TuiElement extends HTMLElement {
    constructor() {
        super();
        this.attributeCount = 0;
        this.renderRequested = false;
        this.rendered = false;
        // The attribute length must be stored in a separate variable so that it can be manipulated.
        this.attributeLength = this.attributes.length;
    }
    connectedCallback() {
        /**
         * If render requested is equal to true, or the attribute length is observed to be 0
         * call the render method and mark the rendered status as true
         */
        if (this.renderRequested === true || this.attributeLength === 0) {
            this.render();
            this.rendered = true;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue; // Set the new value
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
             * Add 1 to the attribute count.
             * 
             * If the attribute count is equal to or greater than the length,
             * mark 'renderRequested' as true
             */
            this.attributeCount++;
            if (this.attributeCount >= this.attributeLength) {
                this.renderRequested = true;
                return;
            }
        }
    }
    /**
     * This method is used to move HTML elements placed inside the custom element tags,
     * to another element withing the custom element.
     * 
     * For example, if you have an un-ordered list 'ul' as a child element of the custom element,
     * you can move list item 'li' tags withing the 'ul'
     * 
     * If more than one tag type needs to be moved, this method can be run twice by the child class.
     */
    moveTaggedChildren(newParent, tag) {
        let elms = this.querySelectorAll(`${tag}`);
        let fragment = document.createDocumentFragment();
        elms.forEach(elm => {
            fragment.appendChild(elm); // Append to fragment
        });
        newParent.appendChild(fragment); // Append all at once to reduce reflows
    }
    /**
     * 
     * This is an older version of 'moveTaggedChildren'
     *
     */
    moveTaggedChildrenOLD(newParent, tag) {
        let elms = this.querySelectorAll(`${tag}`);
        for (let i = 0; i < elms.length; i++) {
            newParent.appendChild(elms[i]); // Appends the new parent node
        }
    }

    moveTextToChild(childElement) {
        let directText = ""; // Initialize a variable to store the direct text
        // Iterate over child nodes of the parent element
        for (const node of this.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                directText += node.textContent.trim() + " "; // Append the trimmed text content to the directText variable
                this.removeChild(node); // Remove the text node from the parent element
            }
        }
        directText = directText.trim();// Trim any trailing whitespace
        childElement.innerText = directText;
    }

    /**
     * This method deletes all child elements from the custom element, except for the one specified. 
     * 
     * For example, if you have an un-ordered list 'ul' as a child element of the custom element,
     * and you only want to allow 'li' elements as children to the custom element,
     * you can use this method to delete other child elements.
     * 
     * THIS WILL BE UPDATED IN THE FUTURE TO ALLOW MULTIPLE TAG TYPES TO BE KEPT,
     * LIKELY USING AN ARRAY AS THE METHOD ARGUMENT.
     */
    deleteChildrenExceptTagged(tag) {
        const children = Array.from(this.children);
        for (let i = 0; i < children.length; i++) {
            if (children[i].tagName.toLowerCase() !== tag.toLowerCase()) {
                children[i].remove();
            }
        }
    }
}
