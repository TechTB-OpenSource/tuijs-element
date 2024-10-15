export class TuiElement extends HTMLElement {
    constructor() {
        super();
        this.attributeCount = 0;
        this.renderRequested = false;
        this.rendered = false;
        this.attributeLength = this.attributes.length; // The attribute length must be stored in a separate variable so that it can be manipulated.
        this.trackedListeners = [];
    }

    /**
     * If render requested is equal to true, or the attribute length is observed to be 0, call the render method and mark the rendered status as true.
     * @returns {void}
     */
    connectedCallback() {
        try {
            if (this.renderRequested === true || this.attributeLength === 0) {
                this.render();
                this.rendered = true;
            }
            console.log(`connectedCallback`);
            console.log(this.trackedListeners);
            return;
        } catch (er) {
            throw new Error(er.message);
        }
    }

    /**
     * 
     * @returns {void}
     */
    disconnectedCallback() {
        try {
            this.removeAllTrackedEvents();
            console.log(`disconnectedCallback`);
            console.log(this.trackedListeners);
        } catch (er) {
            throw new Error(er.message);
        }
    }

    /**
     * Extension of HTMLElement method 'attributeChangedCallback'.
     * Observes element changes
     * @param {string} name 
     * @param {string} oldValue 
     * @param {string} newValue 
     * @returns 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        try {
            console.log(`attributeChangedCallback: START`);
            if (name === 'class') {
                this.attributeCount--;
            }
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
                        this.shadowRoot.removeAllTrackedEvents();
                        this.render();
                        return;
                    }
                    this.replaceChildren(); // This clears the element in prep for rerender - DO NOT REMOVE
                    this.removeAllTrackedEvents();
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
            return;
        } catch (er) {
            throw new Error(er.message);
        }
    }

    /**
     * This method is used to move HTML elements placed inside the custom element tags to another element withing the custom element.
     * 
     * Example; if you have an un-ordered list 'ul' as a child element of the custom element,
     * you can move list item 'li' tags withing the 'ul'
     * 
     * If more than one tag type needs to be moved, this method can be run twice by the child class.
     * @param {Object} newParent - The target new parent element for the tags to be moved to.
     * @param {string} tag - The tag type that will be moved from the parent to the newParent.
     * @returns {void}
     */
    moveTaggedChildren(newParent, tag) {
        try {
            let elms = this.querySelectorAll(`${tag}`);
            let fragment = document.createDocumentFragment();
            elms.forEach(elm => {
                fragment.appendChild(elm); // Append to fragment
            });
            newParent.appendChild(fragment); // Append all at once to reduce reflows
            return;
        } catch (er) {
            throw new Error(er.message);
        }
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
     * @param {string} tag - The HTML tag name type that should be kept.
     * @returns {void}
     */
    deleteChildrenExceptTagged(tag) {
        try {
            const children = Array.from(this.children);
            for (let i = 0; i < children.length; i++) {
                if (children[i].tagName.toLowerCase() !== tag.toLowerCase()) {
                    children[i].remove();
                }
            }
            return;
        } catch (er) {
            throw new Error(er.message);
        }
    }

    /**
     * Adds an event listener that is tracked and removed when the connectedCallback is triggered
     * @param {Element} element 
     * @param {string} eventType 
     * @param {Function} callback 
     */
    addTrackedEvent(element, eventType, callback) {
        try {
            element.addEventListener(eventType, callback);
            this.trackedListeners.push({ element, eventType, callback });
            return;
        } catch (er) {
            throw new Error(er.message);
        }
    }

    /**
     * Adds an event listener that is tracked and removed when the connectedCallback is triggered
     * @param {Element} element 
     * @param {string} eventType 
     * @param {Function} callback 
     */
    removeTrackedEvent(element, eventType, callback) {
        try {
            element.removeEventListener(eventType, callback);
            this.trackedListeners = this.trackedListeners.filter(
                (listener) =>
                    !(listener.element === element && listener.eventType === eventType && listener.callback === callback)
            );
            return;
        } catch (error) {
            throw new Error(`Failed to remove event listener: ${error.message}`);
        }
    }

    removeAllTrackedEvents() {
        try {
            this.trackedListeners.forEach(({ element, eventType, callback }) => {
                element.removeEventListener(eventType, callback);
            });
            this.trackedListeners = [];
            return;
        } catch (er) {
            throw new Error(er.message);
        }
    }
}
