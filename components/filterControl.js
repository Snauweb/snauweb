export { FilterControl }

/*
 * Generic filter controller element
 * Assumes children emits 'stateChange' events on state change
 *
 * Supports <toggle-button>, <text-search>, <drop-down-select>
 *
 * Supervises the state of all children of class ".filter-elem"
 * Labels the filters with the attribute "filterName" if set, otherwise
 * by "filterElem<number>" where <number> is the index of the element
 * in this.controlElems 
 * Listens to state change. On change, update own state and notify
 * any listeners to 'stateChange' events.
 *
 */

class FilterControl extends HTMLElement {

  static attributeNames = [];
  
  constructor() {
    super();
    this.setupState();
    this.setupCallbacks();
    this.broadcastStateUpdate();
  }

  setupState() {
    this.controlElems = this.querySelectorAll('.filter-elem');
    this.filterState = [];
    
    // Initalise filter state objects
    for(let i = 0; i < this.controlElems.length; i++) {
      let curElem = this.controlElems[i];
      let curElemName = curElem.tagName.toLowerCase();

      let filterName = this.controlElems[i].getAttribute('filterName');
      if(filterName === null || filterName === "") {
	filterName = "filterElem" + i;
      }
      let elemState = curElem.getAttribute('state');
      let elemStateName = undefined; // Default, if no state name is defined

      // Who needs hasKey
      try {
	elemStateName =  curElem.DOMstateNames[elemState];
      }
      catch (error) {} // We don't care about the error

      if(curElemName === "drop-down-select") {
	elemStateName = curElem.getAttribute('elemvalue');
      }
      
      this.filterState[i] = {
	elemHandle: curElem,
	filterName: filterName,
	elemState: elemState,
	elemStateName: elemStateName
      }
    }
  }

  // Listen to state change of all .filter-elem children
  setupCallbacks(){
    for(let elemIndex = 0; elemIndex < this.controlElems.length; elemIndex++) {
      let elem = this.controlElems[elemIndex];
      elem.addEventListener('stateChange', (e)=> {
	let elementName = e.detail.element.tagName.toLowerCase();
	
	if(elementName === "toggle-button") {
	  this.filterState[elemIndex].elemState = e.detail.newState.index;
	  this.filterState[elemIndex].elemStateName = e.detail.newState.name;
	}

	else if(elementName === "text-search") {
	  this.filterState[elemIndex].elemState = e.detail.newState;
	}

	else if(elementName === "drop-down-select") {
	  this.filterState[elemIndex].elemState = e.detail.index;
	  this.filterState[elemIndex].elemStateName = e.detail.value;
	}
	
	this.broadcastStateUpdate();
      });
    }
  }
  setupDOM(){} // Initialise DOM elements needed for rendering
  render(){} // Create DOM representation based on internal state

  
  // Notify any stateChange listeners
  broadcastStateUpdate() {
    const updateEvent = new CustomEvent('stateChange', {
      detail: {
	element: this,
	newState: this.filterState
      }
    });
    
    this.dispatchEvent(updateEvent);
  } 

  // Built-ins
  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return FilterControl.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('filter-control', FilterControl);
