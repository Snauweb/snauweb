export { ForslagFilterList }
import { FetchElem } from "./fetchElem.js"

/*
* Wrapper component for full forslag filter list.
* Handles data relating to the forslag list.
* Extends fetchElem for basic apiFetch wrapped fetch API use
*/
class ForslagFilterList extends FetchElem {
  
  constructor() {
    super();
    this.setupDOM();
    this.setupListeners();
    this.setupState();
  }

  // **** SETUP ****
  // Initialise DOM elements needed for rendering
  setupDOM(){
    this.forslagListElem = this.querySelector('forslag-list');
    this.filterControlElem = this.querySelector('filter-control');
  }
  
  // Setup correct inital state (can also be used for reset)
  setupState() {
    this.fetchParams = ""; // The parameters passed to the get-request
    this.filterData = null; // The data for the list
    this.fetchNewData();
  }

  // We must listen for when data is loaded
  setupListeners() {
    this.addEventListener('stateChange', (e) => {
      this.filterData = this.data; // Might need to do something more here
      this.render() //When data has arrived, render it
    })

    this.filterControlElem.addEventListener('stateChange', (e) => {
      console.log("new filter state", e.detail.newState)
      // Update query url
      // run new fetch
      // call render with results
    })
  }
  
  // Main job is to pass new data to forslag-list
  render(){
    // Remember that the data object must be stringified
    this.forslagListElem.setAttribute("data", JSON.stringify(this.filterData));
  } 

  
  // **** FILTER AND DATA FETCH ****
  // Read state of the filter controller. Use it to construct new search params

  updateFetchParams() {
    // TODO
  }

  // Use the src attribute + this.fetchParams to fetch new data
  // using the superclass method loadData()
  fetchNewData() {
    this.loadData() // loads into data based on src, params and method
  }

  // Built-ins

  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }
  
}


customElements.define('forslag-filter-list', ForslagFilterList);
