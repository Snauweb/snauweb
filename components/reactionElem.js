export { ReactionElem }
import { FetchElem } from "./fetchElem.js"
import { isValidID } from "../modules/utils.js"

/*
 * Button for toggeling a reaction to a forslag
 * What forslag exactly must be set
 * Attributes are forslagid=<id> and reaksjonstypeid=<id>, where id is an integer > 0 
 * These attributes, when not set, are null 
 */

// Needs to do basic data fetch and post, use FetchElem as superclass
class ReactionElem extends FetchElem { 

  // Replace these with the attributes you wish to give the element
  static attributeNames = ['forslagid', 'reaksjonstypeid'];
  
  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    this.render(); // Render default state
  }

  setupState() {
    this.payloadIsValid = false; // Set to true by updatePayload
    this.payloadObject = {};
    this.curCount = 0; // Base assumption is no reactions
    this.isReacted = false; // Base assumption is no reactions

    this.setAttribute('src', "/reaksjon")
  }

  updatePayload() {
    let forslagid = this.getAttribute('forslagid');
    let reaksjonstypeid = this.getAttribute('reaksjonstypeid');
    let isValidSoFar = true;

    if(forslagid !== null) {
      this.payloadObject['forslagid'] = forslagid;
    }
    else {
      isValidSoFar = false;
    }

    if(reaksjonstypeid !== null) {
      this.payloadObject['reaksjonstypeid'] = reaksjonstypeid;
    }
    
    else {
      isValidSoFar = false;
    }

    // If both attributes are valid, set payload to valid
    // As the attribute update callback makes sure new values
    // are valid, this can never be unset
    if(isValidSoFar === true) {
      this.payloadIsValid = true;
    }
  }

  // Setters, for when some other source has found the state for us
  setCount(newCount) {
    this.curCount = newCount;
    this.render();
  }

  setToggle(isReacted) {
    this.isReacted = isReacted;
    this.render();
  }
  
  setupDOM(){
    this.reactionCounter = this.querySelector('.reactionCounter');
    this.toggleButton = this.querySelector('toggle-button');
  }

  // Must listen for the toggle button
  setupListeners() {
    // If the button is pressed, a new 
    this.toggleButton.addEventListener('stateChange', (e) => {

      let oldState = this.isReacted;
      
      // By the way we've set it up in forslag/index.html 0 is selected, 1 is unselected
      this.isReacted =
	this.toggleButton.getAttribute('state') === '0' ?
	this.isReacted = true : this.isReacted = false


      // This state change might mean that a new reaction must be sent.
      // Only update if the state actually changed as a result
      if(oldState !== this.isReacted && this.payloadIsValid === true) {
	this.react() // use loadData to send a POST request
      }
    });

    this.addEventListener('stateChange', (e) => {
      if(this.data !== null) {
	
	this.curCount = this.data.numReaksjoner;
	this.render();
      }
      else {
	console.log("this.data is null!")
      }
    });

    
  }

  // Helper methods that configure request parameters and then perform requests
  // Both assumes a valid payload
  // Configure fetch parameters to get, and set the payload to null 
  getNumReactions() {
    this.setAttribute("method", "GET");
    this.setAttribute("params", "id="+this.getAttribute('forslagid'))
    this.loadData();
  }

  // configure fethc parameters for post with this.payloadObject
  react() {
    this.setAttribute("params", "");
    this.setAttribute("method", "POST");
    this.setAttribute("payload", JSON.stringify(this.payloadObject));
    this.loadData();
  }
  
  
  // Create DOM representation based on internal state
  render(){
    this.reactionCounter.textContent = this.curCount;

    let toggleState = this.isReacted == true ? 0 : 1;
    this.toggleButton.setAttribute('state', toggleState);
  }

  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return ReactionElem.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {
    // Ignore changes to null and changes that do not change anything
    if(oldValue === newValue || newValue === null) {
      return
    }

    // Setting any of the ids to invalid values reverts to the old value
    // Setting an ID to a valid value calls updatePayload()
    if(name == 'forslagid') {
      if(!isValidID(newValue)) {
	this.setAttribute('forslagid', oldValue);
      }
      else {
	this.updatePayload()
	if(this.isPayloadValid === true) {
	  // Get the reaction count for the forslag we are looking at
	  this.getNumReactions()
	}
      }
    }

    else if(name == 'reaksjonstypeid' ) {
      if(!isValidID(newValue)) {
	this.setAttribute('reaksjonstypeid', oldValue);
      }
      else {
	this.updatePayload()
	if(this.isPayloadValid === true) {
	  // Get the reaction count for the reaction type we are looking at
	  this.getNumReactions()
	}
      }
    }
    this.render()
  }
  
}


customElements.define('reaction-elem', ReactionElem);
