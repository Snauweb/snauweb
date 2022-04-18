export { ForslagStatusSelection }
import { FetchElem } from "./fetchElem.js"

/*
 * Radio button component for changing the status of a forslag
 * State indicates which button is selected. 0-indexed, read in document order 
 */

class ForslagStatusSelection extends FetchElem { // Might extend other components as well

  static attributeNames = ['state', 'forslagid'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
  }

  setupState() {
    // Assume first element is selected as default
    if(!this.hasAttribute('state')){
      this.setAttribute('state', 0);
    }

    if(!this.hasAttribute('forslagid')) {
      // By default an illegal value, to avoid any unintended database updates
      this.setAttribute('forslagid', -1); 
    }
  }

  // Initialise DOM elements needed for rendering
  // Check the element supposed to be checked based on state attribute (default '0')
  setupDOM(){
    this.radioButtons = this.querySelectorAll('input[type="radio"]');

    // setupState() ensures this is allways set up
    let defaultSelected = this.radioButtons[this.getAttribute('state')];

    // reflect state visually with the checked attribute
    defaultSelected.checked = true;
  }

  setupListeners() {
    
    for(let i=0; i < this.radioButtons.length; i++) {
      let buttonElem = this.radioButtons[i];
      buttonElem.addEventListener('click', (e)=> {
	this.setAttribute('state', i); // <- attribute handling fixes fetch setup
      })
    }

    // Here the actual event goes through
    this.addEventListener("dataLoad", (e)=> {
      const stateChangeEvent = new CustomEvent('stateChange', {
	detail: {
	  newState: this.getAttribute('state')
	}
      });
      this.dispatchEvent(stateChangeEvent);
    });
  }
  
  // Create DOM representation based on internal state
  render(){}

  // State update based on for instance attributes
  update(){}

  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return ForslagStatusSelection.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue === newValue) {
      return; // Nothing really changed
    }

    if(name === "state") {

      // Update visual state
      this.radioButtons[newValue].checked = true;
      this.radioButtons[oldValue].checked = false;

      let curForslagID = this.getAttribute('forslagid')
      // -1 means that the element is not set up yet,
      // do not perform any changes
      if(curForslagID === "-1")
	return; 
      
      // Use superclass to perform an api call to update
      let patchPayload = {
	"forslagid": this.getAttribute('forslagid'),
	"statusid": parseInt(newValue)+1
      };
      
      this.setAttribute('src', '/forslag');
      this.setAttribute('method', 'PUT');
      this.setAttribute('payload', JSON.stringify(patchPayload));
      this.loadData(); // Wait for PUT to complete before notifying parent
    }

    if(name === "forslagid") {
      // Do nothing, the important part here is that forslagid was updated
    }
  }
  
}


customElements.define('forslag-status-selection', ForslagStatusSelection);

