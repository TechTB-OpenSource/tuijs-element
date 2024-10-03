/**
 * Takes an HTML template literal, parses it, then extracts it.
 * All elements in the template MUST be contained within a single set of template tags.
 * THIS IS THE RECOMMENDED PARSER TO USE.
 * @param {string} templateLit - An HTML string containing a <template> tag.
 * @returns {DocumentFragment} - Returns a DocumentFragment which has been parsed and queried.
 * @throws {Error} - Throws error message if error occurs.
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
        throw new Error(er.message);
    }
}

/**
 * Takes an HTML template literal, parses it, then extracts the element.
 * All elements in the template MUST be contained within a single parent element.
 * @param {string} templateLit 
 * @returns {Element} - Returns a element Object which has been parsed and queried.
 * @throws {Error} - Throws error message if error occurs.
 */
function elmCleaner(templateLit) {
    try {
        let parser = new DOMParser();
        let elmBody = parser.parseFromString(templateLit, 'text/html');
        let elms = elmBody.body.querySelectorAll("*");
        return elms[0];
    } catch (er) {
        throw new Error(er.message);
    }
}

/**
 * @typedef {Array} ImageUrls - A list of image urls
 * @property {string} imageUrl - The url of the desired image
 * @property {Array<string>} imageUrlStrings - An Array of image url strings
 */

class TuiElement extends HTMLElement {
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
            this.removedAllTrackedEvents();
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
     * Moves text nodes of the parent element to a specified child element
     * @param {Object} childElement - The target child element where the text will be moved
     * @returns {void}
     */
    moveTextToChild(childElement) {
        try {
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

    removedAllTrackedEvents() {
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
    super.addTrackedEvent(this, 'click', () => this.handleButtonClick());
    return;
  }
  handleButtonClick() {
    const div = this.querySelector('div');
    div.style.backgroundColor = this.color2;
    return;
  }
}
customElements.define('color-box', ColorBox);
