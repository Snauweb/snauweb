export { ForslagFilterList }
import { FetchElem } from "./fetchElem.js"

/*
* Wrapper component for full forslag filter list.
* Handles data relating to the forslag list.
* Extends fetchElem for basic fetching capabilities
*/
class ForslagFilterList extends FetchElem {

  static attributeNames = [];
  
  constructor() {
    super();
    this.setupDOM();
  }

  // **** SETUP ****
  // Initialise DOM elements needed for rendering
  setupDOM(){
    this.dataListElem = this.querySelector('data-list');
    this.filterControlElem = this.querySelector('filter-control');
    this.listWrapperElem = document.createElement('ol');

  }
  
  // Setup correct inital state (can also be used for reset)
  // remember to call method of superclass first, if this is a function overwrite
  setupState() {
    super.setupState();
    this.fetchParams = ""; // The parameters passed to the get-request
  }
  
  render(){} // Create DOM representation based on internal state


  // **** FILTER AND DATA FETCH ****
  // Read state of the filter controller.
  // Use it to construct a new parameter string
  updateFetchParams() {
    // TODO
  }

  // Use the src attribute + this.fetchParams to fetch new data
  // using the superclass method loadData()
  fetchNewData() {
    // TODO
  }

  // Built-ins

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return ForslagFilterList.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('forslag-filter-list', ForslagFilterList);
