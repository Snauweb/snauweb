export { CustomComponent }

/*
 * Template for a new custom component. Contains all lifecylce methods,
 * declaration of attributes, and some placeholder methods for common use patterns.
 * To use, copy this file, replace all occurences of CustomComponent with your own 
 * (capitalised) name, and "custom-component" with a lower case, hyphen separated
 * name. This is the name used for the HTML tag.
 * More documentation at: https://developer.mozilla.org/en-US/docs/Web/Web_Components
 */

class CustomComponent extends HTMLElement { // Might extend other components as well

  static attributeNames = ['attribute1', 'attribute2'];
  
  constructor() {
    super();
  }

  // Common patterns
  setupDOM(){} // Initialise DOM elements needed for rendering
  setupState() {} // Setup correct inital state (can also be used for reset) 
  render(){} // Create DOM representation based on internal state
  update(){} // State update

  // Built-ins

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return CustomComponent.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('custom-component', CustomComponent);

