export { ForslagFilterList }

class ForslagFilterList extends HTMLElement {

  static attributeNames = [];
  
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
  static get observedAttributes() { return ForslagFilterList.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('forslag-filter-list', ForslagFilterList);
