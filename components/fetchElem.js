export { FetchElem }


/*
 * Wrapper for component that needs to fetch data from the web
 * Can also be used as base class 
 * You must provide a template for the content.
 * You can include a template for a load screen (default is just some text)
 * You can include a template for an error screen (default is the error payload in text)
 */
class FetchElem extends HTMLElement {

  static attributeNames = ['src'];
  
  constructor() {
    super();
  }

  // Common patterns
  setupDOM(){} // Initialise DOM elements needed for rendering
  setupState() {} // Setup correct inital state (can also be used for reset) 
  render(){} // Create DOM representation based on internal state
  loadData() {} // Get data from endpoint specified in attribute

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


customElements.define('fetch-elem', FetchElem);
