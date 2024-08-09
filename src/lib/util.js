/**
 * @typedef {Array} ImageUrls - A list of image urls
 * @property {string} imageUrl - The url of the desired image
 * @property {Array<string>} imageUrlStrings - An Array of image url strings
 */

/**
 * Loads all images and returns a promise when loading is complete
 * @param {ImageUrls} imageUrls - An Array of image url strings
 * @returns {Object}
 */
export async function preloadImages(imageUrls) {
    try {
        const loadImage = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
                img.src = url;
            });
        };
        await Promise.all(imageUrls.map(loadImage));
    } catch (er) {
        console.error(er);
    }
}

/**
 * Adds and intersectionObserver for a list of target elements, that calls a function when 
 * @param {Array} targets - An array of elements that will be attached to the observer.
 * @param {Function} callback - The callback function that will run when the observer is triggered.
 * @param {Object} observerOptions - An Object containing the observer options. By default only threshold is set.
 * @returns {Function} - Returns a cleanup function that will disconnect the observer. This is not required to use.
 */
export function scrollIntoView(targets, callback, observerOptions = { threshold: 0.5}) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {  // Only trigger when the element is intersecting
                callback(entry.target);
            }
        });
    }, observerOptions);
    targets.forEach(target => {
        observer.observe(target);
    });
    // Return a cleanup function to disconnect the observer
    return () => {
        observer.disconnect();
    };
}
