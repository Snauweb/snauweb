export { DropDownSelect }

/*
 * Wrapper element for a select element. 
 * Can be preset to a given state by the "stateIndex" attribute
 */

class DropDownSelect extends HTMLElement {

  static attributeNames = ["state"];
  
  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
  }

  
  setupState() {
    // Ensure that the stateIndex is consistent.
    // If it is set to a value, the attribute changed callback will ensure consistency
    if(!this.hasAttribute("state")) {
      this.setAttribute("state", "0") // Default value 0
    }
  }

  // Initialise DOM elements needed for rendering
  setupDOM(){
    this.selectMenu = this.querySelector('select');
    this.options = this.selectMenu.querySelectorAll('option');
    this.numOptions = this.options.length;
  }

  // To obeserve changes in the select element, we must listen for it
  setupListeners() {
    this.selectMenu.addEventListener('change', (e) => {
      let selectedValue = this.selectMenu.value;
      let selectedOptionIndex = this.searchForValueInOptions(selectedValue)

      // Handles if the value was not found and selectedOptionIndex is -1
      this.setAttribute("state", selectedOptionIndex)
    })
  }

  // Linear search for value to avoid the use of css selectors.
  // Allows for values containing things like '.', avoiding
  // the quite strict requirements for css queries
  // Returns index, or -1 if not found
  searchForValueInOptions(value) {
    for (let curIndex = 0; curIndex < this.options.length; curIndex++) {
      if (value === this.options[curIndex].getAttribute('value')) {
	return curIndex;
      }
    }

    return -1;
  }
  

  reflectElemValue() {
    this.setAttribute('elemvalue',
		      this.getOptionValue(parseInt(this.getAttribute('state'))));
  }

  broadcastStateChange() {    
    const toggleEvent = new CustomEvent('stateChange', {
      detail: {
	element: this,
	index: this.getAttribute('state'),
	value: this.getAttribute('elemvalue')
	      }
    })

    this.dispatchEvent(toggleEvent);
  }
  
   // Takes an state, returns the value. Clips input
  getOptionValue(index) {
    if(index < 0) {
      index = 0;
    }
    if(index >= this.numOptions) {
      index = this.numOptions-1;
    }

    return this.options[index].value
  }
  
  
  // Create DOM representation based on internal state
  render(){}

  // State update based on for instance attributes
  update(){}

  // Linear search for node in this.options to find index
  findIndex(nodeList, node) {
    let index = -1;
    
    for(let i = 0; i < this.options.length; i++) {
      if(nodeList[i] === node) {
	index = i;
	break;
      }
    }
    
    // If the node was not found, return -1 to indicate this
    return index;
  }

 
  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return DropDownSelect.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {
    // No real change, no work to be done
    if(newValue === oldValue) {
      return;
    }

    if(name === 'state') {
      let newValueNumber = Number(newValue);
      
      // If an illegal stateIndex is input, set to 0
      if(isNaN(newValueNumber) ||
	 newValueNumber < 0 || newValueNumber >= this.numOptions) {
	this.setAttribute("state", "0");
	return;
      }

      // After consistency is ensured, the index value must be reflected in
      // the select

      // The number must be translated to an option value atribute
      let newOptionValue = this.options[newValueNumber].value;
      this.selectMenu.value = newOptionValue;

      // Now that the new option index, the option value must be reflected to an attribute
      this.reflectElemValue();
    }

    // The state has changed, we must notify any listeneres
    this.broadcastStateChange();
  }
  
}


customElements.define('drop-down-select', DropDownSelect);

