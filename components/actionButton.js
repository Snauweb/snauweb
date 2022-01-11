export { ActionButton }
import { FetchElem } from "./fetchElem.js"

/*
 * Button that performs a fetch request through it's fetchElement superclass
 * Expects a button as a child to listen to clicks from
 */

class ActionButton extends FetchElem { 

  // These match 
  static attributeNames = ['']; // We only use the attribs of fetch elem

  // The constructor runs before the element is created and inserted into the DOM
  // Use it for setup
  // NB: super() MUST be called before anything else in the constructor
  constructor() {
    super();
    this.setupState();
    this.setupListerners();
  }

  // **** COMMON PATTERNS ****
  // Setup correct inital state (can also be used for reset)
  // It is recomended to declare any object variables (this.<variableName>)
  // in this method, to make it easier to see what variables exist at a glance
  setupState() {
    this.buttonChild = this.querySelector('button');
  }

  setupListerners() {
    this.buttonChild.addEventListener('click', (e) => {
      this.loadData();

      const clickEvent = new CustomEvent("actionClick")
      this.dispatchEvent(clickEvent); 
    });
  }
  
  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return ActionButton.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('action-button', ActionButton);
