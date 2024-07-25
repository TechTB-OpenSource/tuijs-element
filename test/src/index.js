// NEED TO COME BACK TO THIS AT SOME POINT
export class TuiElement extends HTMLElement {
    constructor() {
        super();
        this.attributeCount = 0;
        this.renderRequested = false;
        this.rendered = false;
        this.attributeLength = this.attributes.length;
        console.log(this.attributes.length)
        for (let i = 0; i < this.attributes.length; i++) {
            console.log(this.attributes[i])
        }
        /**
         * Define default attribute values
         */
        this.defaultAttributes = [
            'id',
            'name',
            'title',
            'href',
            'value',
            'checked'
        ];
        this.nonRerenderAttributes = [
            'id',
            'name',
            'title',
            'checked'
        ];
        /**
         * Iterate through each default value and if there is a matching attribute name, 
         * Reduce the attribute length by 1 for each match
         * NOT WORKING******************
         */

        /*
        this.defaultAttributes.forEach(element => {
            // Iterate over the NamedNodeMap
            console.log(`ATTRIBUTES ALL: ${JSON.stringify(this.attribute)}`)
            for (let i = 0; i < this.attributes.length; i++) {
              // Check if the 'name' attribute matches the current element
              // Assuming you're interested in the 'name' attribute
              console.log(`ATTRIBUTE: ${this.attributes[i].name}`)
              if (this.attributes[i].name === 'name' && this.attributes[i].value === element) {
                console.log(`ATTRIBUTE LENGTH --`)
                attributeLength--;  // Decrement the count for each match
                break;  // Exit the loop after the first match
              }
            }
          });
        */

        /**
         * This is the old iteration. It did not allow for an attribute array.
         */
        /*
        for (let i = 0; i < this.attributes.length; i++) {
            if (
                this.attributes[i].name === 'id' ||
                this.attributes[i].name === 'name' ||
                this.attributes[i].name === 'title' ||
                this.attributes[i].name === 'href' ||
                this.attributes[i].name === 'value' ||
                this.attributes[i].name === 'checked'
            ) {
                this.attributeLength--;
            }
        }
        */
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
                /*
                for (let i = 0; i < nonRerenderAttributes.length; i++) {
                    if (name === nonRerenderAttributes[i]) {
                        return;
                    }
                }
                    */

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
            console.log(`length: ${this.attributeLength} - count: ${this.attributeCount}`);
        }
    }
    moveTaggedChildren(newParent, tag) {
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
