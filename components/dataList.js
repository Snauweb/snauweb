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
 *     dataListStatus: "empty" | "filled" | "error".  
 */

class DataList extends HTMLElement {

  static attributeNames = ['data'];
  
  constructor() {
    super();
    this.setupState();
    this.setupDOM();
  }

  // **** SETUP ****
  // Setup correct inital state (can also be used for reset) 
  setupState() {
    this.displayData = null;
    this.dataListStatus = "empty"

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

  // Create DOM representation based on internal state
  // In this component, calling render() should fill the list with data rendered in the
  // provided .dataListElem element, as long as the status is not "error" or "empty"
  render(){
    if(this.dataListStatus === "error") {
      this.renderError();
    }
    else if(this.dataListStatus === "empty") {
     this.renderEmpty(); 
    }
    else {
      this.renderContent();
    }
  }

  renderError() {
  
  }
  renderEmpty() {

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
  // this.listState to "error"
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
    
    this.displayData = parseResult;
    this.dataListStatus = "filled";
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
