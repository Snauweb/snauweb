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
    this.fetchNewData();
  }

  // **** SETUP ****
  // Initialise DOM elements needed for rendering
  setupDOM(){
    this.forslagListElem = this.querySelector('forslag-list');
    this.filterControlElem = this.querySelector('filter-control');
  }
  
  // Setup correct inital state (can also be used for reset)
  setupState() {
    this.filterState = null;
    this.fetchParams = ""; // The parameters passed to the get-request
    this.filterData = null; // The data for the list
    this.queryParams = ""; // Easisest to generate new in full every request
  }

  // We must listen for when data is loaded
  setupListeners() {

    this.addEventListener('stateChange', (e) => {
      console.log("New data just arrived", this.data)
      this.filterData = this.data; // Might need to do something more here
      this.render() //When data has arrived, render it
    })

    this.filterControlElem.addEventListener('stateChange', (e) => {
      console.log("new filter state", e.detail.newState)
      this.filterState = e.detail.newState;
      this.updateQueryParams();
      this.updateFetchParams();
      this.fetchNewData();
    })
  }
  
  // Main job is to pass new data to forslag-list
  render(){
    // Remember that the data object must be stringified
    this.forslagListElem.setAttribute("data", JSON.stringify(this.filterData));
  } 

  
  // **** FILTER AND DATA FETCH ****
  // Read state of the filter controller. Use it to construct new search params

  updateQueryParams() {
    let newQueryParams = "";
    let sortParamField = "dato"; // defaults
    let sortParamOrder = "desc"; // defaults
    // -1 is a category that does not exist, will force no results if it's the only one
    let categories = "-1,";
    
    // go through all filter settings
    for(let i = 0; i < this.filterState.length; i++) {
      let curFilter = this.filterState[i];
      let curFilterName = curFilter.filterName;

      console.log(curFilter)

      if(curFilterName === "tekstsøk") {
	let searchString = curFilter.elemState;
	console.log("new search string", searchString)
	// Search string might be empty. In which case, we don't use it
	if(searchString !== null && searchString !== "") {
	  newQueryParams += ("sok=" + searchString + "&")
	}
      }

      else if(curFilterName === "sorterEtter") {
	let curFilterState = curFilter.elemStateName.toLowerCase();
	let legalStates = ["stemmer", "dato", "kategori"]
	if(legalStates.includes(curFilterState)) {
	  sortParamField = curFilterState; 
	}
      }

      else if(curFilterName === "sortOrder") {
	let curFilterState = curFilter.elemStateName.toLowerCase();
	let legalStates = ["asc", "desc"]
	if(legalStates.includes(curFilterState)) {
	  sortParamOrder = curFilterState; 
	}
      }

      else if(curFilterName === "toggleNew") {
	let curFilterState = curFilter.elemStateName.toLowerCase();
	if(curFilterState === "checked") {
	  categories += "1,";
	}
      }	

      else if(curFilterName === "toggleWorking") {
	let curFilterState = curFilter.elemStateName.toLowerCase();
	if(curFilterState === "checked") {
	  categories += "2,";
	}
      }

      else if(curFilterName === "toggleFinished") {
	let curFilterState = curFilter.elemStateName.toLowerCase();
	if(curFilterState === "checked") {
	  categories += "3,";
	}
      }

    }

    newQueryParams += ("kategorier=" + categories + "&");
    newQueryParams += ("sorter=" + sortParamField + '-' + sortParamOrder + "&");
    this.queryParams = newQueryParams;
  }
  
  updateFetchParams() {
    this.setAttribute('params', this.queryParams);
  }

  // Use the src attribute + this.fetchParams to fetch new data
  // using the superclass method loadData()
  fetchNewData() {
    console.log("Fetching new data with following parameters", this.getAttribute('params'))
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
