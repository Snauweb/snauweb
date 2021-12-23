export { TextSearch }

/*
 * Controller for text search element.
 * [Requires] an input child of class .search-field for the search field text input 
 * [Optional] a button child of class .search-submit for the search field text submit button
 *
 * If the attribute eager is set to true, stateChange events are emitted on value change
 * of the .search-field 
 */

class TextSearch extends HTMLElement {

  static attributeNames = ['eager'];
  
  constructor() {
    super();
    this.setupState();
  }

  // Common patterns
  // Setup correct inital state
  setupState() {

    // By default eager. Any empty or non-false inital values of the attrib -> true
    let isEager = this.getAttribute('eager');
    if (isEager === null || isEager === '' || isEager !== 'false') {
      this.setAttribute('eager', 'true');
    }
    else if (isEager === 'false') { // Just to be extra explicit about it 
      this.setAttribute('eager', 'false');
    }

    // Look for the search field
  } 
  setupDOM(){} // Initialise DOM elements needed for rendering
  render(){} // Create DOM representation based on internal state
  update(){} // State update

  // Built-ins

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return TextSearch.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue === newValue) {
      return; // Nothing really changed, return
    }

    if(name === 'eager') {

    }
  }
  
}


customElements.define('text-search', TextSearch);

