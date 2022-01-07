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
    this.setupDOM();
    this.setupListeners();
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
  } 

  setupDOM(){
    this.searchField = this.querySelector('.search-field');
    this.searchSubmit = this.querySelector('.search-submit');
  }

  // Listen both to input and submit, use this.isEager to determine response
  // We use () => () syntax for the listener functions, they "this" they capture
  // is the objcet this.
  setupListeners() {
    // Search field brodcasts on any input event if the attribute "eager" is set to true
    this.searchField.addEventListener('input', (e) => {
      if(this.getAttribute('eager') === "true") {
	this.broadcastStateChange()
      }
    });

    // The submit button allways broadcasts an event
    this.searchSubmit.addEventListener('click', (e) => {
	this.broadcastStateChange()
    });
  }

  broadcastStateChange() {
    // First, the custom event
    const stateChangeEvent = new CustomEvent("stateChange", {
      detail: {
	element: this,
	newState: this.searchField.value
      }
    });

    this.dispatchEvent(stateChangeEvent);
  }
  
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

