export { LaatListFilters }

/*
 * Filter collection for laat list
 * Listens for StateChange events for any DOM children with the class .filter-elem
 * These children might have the attribute "filtername" set to provide a label
 * in the filter information object, otherwise the label will be left undefined
 */

class LaatListFilters extends HTMLElement {
  
  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
  }

  setupState() {
    this.filterElemsInfo = [];
    // Used to name filters without the attribute "filtername" set
    this.filterSerialNumber = 0;

    this.filterState = {
      searchValue: "" 
    }
  }


  
  setupDOM() {
    let filterElems = this.querySelectorAll(".filter-elem");

    // Wrap all filter elements in a data structure
    for (let elem of filterElems) {

      let filterName = null;
      if (elem.hasAttribute("filtername")) {
	filterName = elem.getAttribute("filtername");
      }
      else {
	filterName = "filter " + this.filterSerialNumber;
	this.filterSerialNumber += 1;
      }


      let newInfoElem = {
	DOMElem: elem,
	filterName: filterName
      }

      this.filterElemsInfo.push(newInfoElem)
    }
  }
  
  setupListeners() {
    for (let filterInfo of this.filterElemsInfo) {
      let curFilterElem = filterInfo.DOMElem;
      let curFilterElemName = filterInfo.filterName;
      curFilterElem.addEventListener(
	"stateChange",
	(e) => {
	  let newState = e.detail.newState;
	  if (curFilterElemName === "låtsøk" && this.filterState.searchValue !== newState) {
	    this.filterState.searchValue = newState;
	    this.broadcastStateChange()
	  }
	}
      );
    }
  }

  // Notify listeners of a new filter state
  broadcastStateChange() {
    const stateChangeEvent = new CustomEvent("stateChange", {
      detail: {
	element: this,
	newState: this.filterState
      }
    });

    this.dispatchEvent(stateChangeEvent);
  }
  
  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return LaatListFilters.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('laat-list-filters', LaatListFilters);
