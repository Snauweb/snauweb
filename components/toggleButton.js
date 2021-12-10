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
  static attributeNames = ['state'];
  
  constructor() {
    super();
    // The order is important here!
    this.setupState();
    this.setupDOM();
    this.setupEventHandling();
    this.render();
  }

  // Common patterns

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
    this.wrapperDiv = document.createElement('div');
    this.appendChild(this.wrapperDiv);
  } 

  setupState() {
    // Read content template, count number of requested states
    this.statesTemplate = this.querySelector("template");    
    this.numStates = this.statesTemplate.content.children.length;

    // Validate inital state
    let curState = this.getAttribute("state");
    if(this.isStateValid(curState) === false) {
      this.setAttribute('state', '0');
    }

    this.prevState = null;
    
  }

  setupEventHandling() {
    this.addEventListener('click', this.handleClick);
    this.addEventListener('stateChange', (e) => {
      console.log("The state changed! Here is some info:", e.detail);
    })
  }

  // Create DOM representation based on internal state
  render(){

    let curState = Number.parseInt(this.getAttribute('state'));
    // If a DOM state is allready rendered, it must be removed
    if(this.prevState !== null) {
      this.wrapperDiv.removeChild(this.DOMstates[this.prevState]);
    }
    
    this.wrapperDiv.appendChild(this.DOMstates[curState]);
  } 


  // handlers
  handleClick() {
    let curState = parseInt(this.getAttribute('state'));
    this.prevState = curState;
    let newState = curState + 1;

    if(this.isStateValid(newState) == false) {
      newState = 0;
    }
    
    this.setAttribute('state', newState);

    const toggleEvent = new CustomEvent("stateChange", {
      detail: {
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
    this.render();
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
  static get observedAttributes() { return ['state']; }

  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue !== newValue) {
      if(name === 'state') {
	if(this.isStateValid(newValue) === false) {
	  this.setAttribute('state', '0');
	}
	else {
	  this.setAttribute('state', newValue);
	}
      }
    }
  }
  
}


customElements.define('toggle-button', ToggleButton);
