export { CustomComponent }

class CustomComponent extends HTMLElement {

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
  static get observedAttributes() { return attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('custom-element', CustomElement);

