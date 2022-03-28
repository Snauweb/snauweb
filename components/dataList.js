export { DataList }

/*
 * Component that displays data in list format.
 * Expects a <template> of class .dataListItem as child
 * Attributes:
 *     data: a string representation of the currently rendered data (JSON)
 *          (if this is too much of a performance hit, make this an internal field)
 * 
 * Object fields:
 *     displayData: contains parsed data to be displayed in the list elements.
 *                  Allways a list, even if it only contains a single object
 *     dataListStatus: "initial" | "empty" | "filled" | "error".
 *
 * Dispatches renderInitial(), renderEmpty(), renderContent() or renderError() respectivly
 * on call to render(), depending on dataListStatus
 *
 * Emits a stateChange event on state change
 */

class DataList extends HTMLElement {

  static attributeNames = ['data'];
  
  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.render();
  }

  // **** SETUP ****
  // Setup correct inital state (can also be used for reset) 
  setupState() {
    this.displayData = null;
    this.dataListStatus = "initial"

    // reads data attribute (if it exists)
    this.parseDataAttrib();
  } 

  // Initialise DOM elements needed for rendering
  setupDOM(){
    this.listWrapperElem = document.createElement('ol');
    this.listElemWrap = document.createElement('li');
    
    let listElemTemplate = document.querySelector('template.dataListElem');
    if(listElemTemplate === null) {
      this.listElemWrap.textContent="No template of class .dataListElem provided in data-list";
    }
    else {
      let tempNode = document.createElement('div');
      tempNode.appendChild(listElemTemplate.content.cloneNode(true));
      this.listElemWrap = tempNode.querySelector('li');
    }

    this.appendChild(this.listWrapperElem);
  }

  dispatchStateChangeEvent() {
    const stateChangeEvent = new CustomEvent('stateChange', {detail: this.displayData});
    this.dispatchEvent(stateChangeEvent);
  }
  
  // Create DOM representation based on internal state
  // In this component, calling render() should fill the list with data rendered in the
  // provided .dataListElem element, if the state is "filled"
  render(){

    if (this.dataListStatus === "error") {
      this.renderError();
    }
    else if (this.dataListStatus === "empty") {
      this.renderEmpty(); 
    }
    else if (this.dataListStatus === "initial") {
      this.renderInitial();
    }
    else {
      this.renderContent();
    }
  }

  renderInitial() {
    this.renderEmpty();
  }
  renderError() {
    this.listWrapperElem.textContent = "Noe gikk galt, prøv igjen!"
  }
  renderEmpty() {
    this.listWrapperElem.textContent = "Ingenting å vise"
  }
  renderContent() {
    // Copy old top level element (non-recursive, no children are included)
    let newListWrapper = this.listWrapperElem.cloneNode();
    
    // iterate over all displayData, fill templates where class and key match
    for(let dataObj of this.displayData) {
      
      // Copy the list item template
      let curListItem = this.listElemWrap.cloneNode(true);

      for(let key in dataObj) {
	// Add the text content of the key to a matching node, if found
	let matchingNode = curListItem.querySelector("." + key);
	if(matchingNode !== null) {
	  matchingNode.textContent = dataObj[key];
	}
      }
      
      newListWrapper.appendChild(curListItem);
    }
    
    // Replace old list with new
    this.replaceChild(newListWrapper, this.listWrapperElem);
    this.listWrapperElem = newListWrapper;
  }
  
  // State update. Main job is to turn the data attribute from a string into a json
  // object.
  update(){
    this.parseDataAttrib();
  }

  // Parse the data attribute as json and put in this.displayData
  // If the parsing does not work, set this.displayData to null and set
  // this.dataListStatus to "error"
  parseDataAttrib() {
    let parseResult = null;
    try {
      parseResult = JSON.parse(this.getAttribute('data'));
    }
    catch(SyntaxError){
      this.dataListStatus = "error";
      this.displayData = null;
      return;
    }

    if(parseResult === null) {
      if(this.dataListStatus !== "initial") {
	this.dataListStatus = "empty";
      }
    }
    else {
      this.dataListStatus = "filled";
    }

    this.displayData = parseResult;

    this.dispatchStateChangeEvent();
  }

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return DataList.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue != newValue) {
      if(name === 'data') {
	this.update();
	this.render();
      }
    }
  }
}


customElements.define('data-list', DataList);
