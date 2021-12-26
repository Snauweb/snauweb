export { CustomComponent }

/*
 * Template for a new custom component. Contains all lifecylce methods,
 * declaration of attributes, and some placeholder methods for common use patterns.
 * 
 * To use, copy this file, replace all occurences of CustomComponent with your own 
 * (capitalised) name, and "custom-component" with a lower case, hyphen separated
 * name. This is the name used for the HTML tag.
 * 
 * More documentation at: https://developer.mozilla.org/en-US/docs/Web/Web_Components
 */

class CustomComponent extends HTMLElement { // Might extend other components as well

  // Replace these with the attributes you wish to give the element
  static attributeNames = ['attribute1', 'attribute2'];
  
  constructor() {
    super();
  }

  // **** COMMON PATTERNS ****
  // Setup correct inital state (can also be used for reset)
  // It is recomended to declare any object variables (this.<variableName>)
  // in this method, to make it easier to see what variables exist at a glance
  setupState() {}

  // Initialise DOM elements needed for rendering
  setupDOM(){}

  // Create DOM representation based on internal state
  render(){}

  // State update based on for instance attributes
  update(){}

  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return CustomComponent.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('custom-component', CustomComponent);

