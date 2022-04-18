export { LaatFilterList }

import { FetchElem } from "./fetchElem.js"

/*
 * Filter list for laater without selection
 * Extends fetchElem for fetch functionality
 * 
 * Assumes children: 
 *   <laat-list-filters>, <laat-list-display>
 *
 * By default, it loads all data from the endpoint and filters based on filter
 * settings. It only fetches new data on page reload.
 * 
 * this.filterData contains all the data in the component
 * this.displayData contains the data to be rendered in the list
 * Data is transfered from filterData to displayData by calling
 * applyFilters(). This ensures only data obeying the filter rules is shown
 */

class LaatFilterList extends FetchElem {
  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    this.loadData();
  }

  setupState() {
    this.filterState = {
      searchValue: ""
    };
    
    this.fetchParams = ""; // The parameters passed to the get-request

    // Full data. Currently debug values
    this.filterData = [];
    this.queryParams = ""; // Easisest to generate new in full every request

    // Now we configure the parent fetchElem
    this.setAttribute("src", "/laater");

    // No data to display initally
    this.displayData = null;
  }
  
  setupDOM(){
    this.filterControlElem = this.querySelector("laat-list-filters");
    this.listDisplayElem = this.querySelector("laat-list-display");
  }

  setupListeners() {
    // Listen for data load
    // Add all data to this.filterData
    this.addEventListener('dataLoad', (e) => {
      this.filterData = this.data;
      this.applyFilters();
    });

    // Update data and rerender on filter change
    this.filterControlElem.addEventListener('stateChange', (e) => {
      let newSearchValue = e.detail.newState.searchValue;
      
      this.filterState.searchValue = newSearchValue;
      this.applyFilters();
    });
  }
  

  // Filters the loaded data according to the filter rules
  applyFilters() {    
    let newDisplayData = []

    // For every data item in full data set, check against all filters
    // If all filters match, include, otherwise move to the next data item
    for (let dataItem of this.filterData) {
      
      // The search field. JS by default looks for matches anywhere in the string.
      // This is, fortunatly, the behaviour we want.
      // To match in a case insensitive way, we translate to lower case
      let searchRegEx = new RegExp(this.filterState.searchValue.toLowerCase());

      let nameMatch = false;
      let genereMatch = false;

      if(dataItem.navn !== null && dataItem.navn !== undefined) {
	nameMatch = searchRegEx.test(dataItem.navn.toLowerCase());
      }

      if(dataItem.sjanger !== null && dataItem.navn !== undefined) {
	genereMatch = searchRegEx.test(dataItem.sjanger.toLowerCase());
      }

      // No match means we try the next one
      if(nameMatch === false && genereMatch === false) {
	continue;
      }

      // All filters match, include in display set
      newDisplayData.push(dataItem)
    }

    // If no data is to be shown, we send null to the
    // display list component to indicate no results
    if(newDisplayData.length === 0) {
      newDisplayData = null;
    }

      
    // transfer to displayData
    this.displayData = newDisplayData;
    this.render();
  }

  // Passes this.displayData to the laat-list-display as a string parameter
  // This is not efficient, as it has to be string-encoded as json, but
  // it operates nicely with HTML-element attributes. As long as
  // performance remains OK, it's all fine
  render() {
    let dataAsString = JSON.stringify(this.displayData);
    this.listDisplayElem.setAttribute("data", dataAsString);
  }
  
  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return LaatFilterList.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('laat-filter-list', LaatFilterList);
