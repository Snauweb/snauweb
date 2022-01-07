/*
 * Element that can be toggeled between multiple states
 * The toggelable states are included in a template. Each top-level element
 * are considered to be a state, and they are 0-indexed top to bottom 
 *
 * On a toggle, the element emits an event of type 'stateChange'
 *
 * Attributes:
 * state=<stateIndex>. Default: "0". On illegal index: treated as "0"
 * 
 * State DOM nodes can include the attribute stateName, which will be emitted
 * along with the state id on a toggle event
 * <toggle-button state="0">
 *   <template>
 *     <div stateName="the best state!"></div>
 *     <div></div>
 *     <div></div>
 *   </template>
 * </toggle-button>
 */

export { ToggleButton }

class ToggleButton extends HTMLElement {
  static attributeNames = ['state', 'debounce'];
  
  constructor() {
    super();
    // The order is important here!
    this.setupState();
    this.setupDOM();
    this.setupEventHandling();
    this.render();
  }

  // Common patterns
  setupState() {
    // Read content template, count number of requested states
    this.statesTemplate = this.querySelector("template");    
    this.numStates = this.statesTemplate.content.children.length;

    // Validate inital state. isStateValid handles undefined state
    // Guarantees legal state after init
    let curState = this.getAttribute("state");    
    if(this.isStateValid(curState) === false) {
      this.setAttribute('state', '0');
    }

    // Set debounce to 0 if not specified
    if(!this.hasAttribute("debounce")) {
	this.setAttribute("debounce", "0");
      }
  
    
    this.debounceActive = false; // No debounce activation before click
    this.prevState = null;
      
  }
  
  // Initialise DOM elements needed for rendering
  setupDOM(){

    // List of the DOM nodes corresponding to each state
    this.DOMstates = [];
    this.DOMstateNames = [];
    
    for(let i = 0; i < this.numStates; i++) {
      this.DOMstates[i] = this.statesTemplate.content.children[i].cloneNode(true);
      let curStateName = this.DOMstates[i].getAttribute('stateName');
      if(curStateName === null || curStateName === "") {
	this.DOMstateNames[i] = i.toString(); 
      }
      else {
	this.DOMstateNames[i] = curStateName;
      }
    }
    this.wrapperElem = document.createElement('button');

    // Remove button styling, and make wrapper
    // button element styles behave like the div
    this.wrapperElem.style.background = "none";
    this.wrapperElem.style.color = "inherit";
    this.wrapperElem.style.border = "none";
    this.wrapperElem.style.padding = "0";
    this.wrapperElem.style.cursor = "pointer";
    this.wrapperElem.style.outline = "inherit";
    this.wrapperElem.style.display = "inline-block";
    this.wrapperElem.style.font = "inherit";
    this.wrapperElem.style.width = "100%";
    
    
    this.appendChild(this.wrapperElem);
  }
  
  setupEventHandling() {
    this.addEventListener('click', this.handleClick);
  }

  // Create DOM representation based on internal state
  render(){
    let curState = Number.parseInt(this.getAttribute('state'));
    // If a DOM state is allready rendered, it must be removed
    if(this.prevState !== null) {
      this.wrapperElem.removeChild(this.DOMstates[this.prevState]);
    }
    
    this.wrapperElem.appendChild(this.DOMstates[curState]);
  } 


  // handlers
  handleClick() {
    // Disregard clics during debounce period
    if(this.debounceActive)
      return;

    // Debounce handling, if enabled
    if(this.hasAttribute("debounce") &&
       parseInt(this.getAttribute("debounce")) > 0) {
      this.debounceActive = true;
      this.wrapperElem.setAttribute("disabled", "");
      this.wrapperElem.style.opacity = "0.4";

      // Callback to release debounce lock
      setTimeout(
	()=>{
	  this.debounceActive = false;
	  this.wrapperElem.removeAttribute("disabled");
	  this.wrapperElem.style.opacity = "1";
	},
	this.getAttribute("debounce")
      );
    }
    let curState = parseInt(this.getAttribute('state'));
    this.prevState = curState;
    let newState = curState + 1;

    if(this.isStateValid(newState) == false) {
      newState = 0;
    }
    
    this.setAttribute('state', newState);

    const toggleEvent = new CustomEvent("stateChange", {
      detail: {
	element: this,
	newState: {
	  index: newState,
	  name: this.DOMstateNames[newState]
	},
	oldState: {
	  index: curState,
	  name: this.DOMstateNames[curState]
	}
      }
    });
    this.dispatchEvent(toggleEvent);
  }

  // Utils
  
  isStateValid(newState) {
    let newStateInt = parseInt(newState);
    
    // Illegal states are changed to 0
    if(newState === undefined ||
       Number.isNaN(newStateInt) ||
       newStateInt >= this.numStates ||
       newStateInt < 0
    ) {
      return false;
    }
    return true;

  }
  
  // Built-ins
  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return ToggleButton.attributeNames; }

  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  // This calls render, so that any attribute change is imidiatly reflected in DOM
  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue !== newValue) {
      if(name === 'state') {
	if(this.isStateValid(newValue) === false) {
	  this.setAttribute('state', '0');
	}
	else {
	  this.setAttribute('state', newValue); // Hang on does this line make sense?
	  this.prevState = oldValue;
	}
      }
      this.render();
    }
  }
  
}


customElements.define('toggle-button', ToggleButton);
