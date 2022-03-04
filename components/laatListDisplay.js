export { LaatListDisplay }
import { DataList } from "./dataList.js"

class LaatListDisplay extends DataList {

  constructor() {
    super();
    this.hasLoadedFirstTime = false;
    this.addEventListener('stateChange', (e) => {
      this.hasLoadedFirstTime = true;
    });
  }

  // Overwrite DataList implementation
  // Empty list before any data load has happened means we are loading
  // Empty list after inital load means there is no data to show
  renderEmpty() {
    if(this.hasLoadedFirstTime === false || this.hasLoadedFirstTime === undefined) {
      this.listWrapperElem.textContent = "Laster..."
    }
    else {
      this.listWrapperElem.textContent = "Ingen låter å vise. Prøv å søke på noe annet?";
    }
  }
  
  // Overwrite DataList implementation
  renderContent() {
    
    // Copy old top level element (non-recursive, no children are included)
    let newListWrapper = this.listWrapperElem.cloneNode();

    // No data is a legal state. In this case, render nothing
    if(this.displayData === null) {
     
    }

    // There is data to be shown, generate the list
    else {
      // iterate over all displayData objects
      for(let dataObj of this.displayData) {
	
	// Copy the list item template
	let curListItem = this.listElemWrap.cloneNode(true);

	// First we set up the title link
	let titleElem = curListItem.querySelector(".navn");
	let laatLinkElem = document.createElement("a");

	laatLinkElem.setAttribute("href", `./laat/?id=${dataObj["id"]}`);
	laatLinkElem.textContent = dataObj["navn"];
	
	titleElem.appendChild(laatLinkElem);

	// Then the genere in parentheses
	let genereElem = curListItem.querySelector(".sjanger");
	genereElem.textContent = "(" + dataObj["sjanger"] + ")";

	// Add to full list
	newListWrapper.appendChild(curListItem);
      }
    }
    // Replace old list with new
    this.replaceChild(newListWrapper, this.listWrapperElem);
    this.listWrapperElem = newListWrapper;
  }
  
  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return LaatListDisplay.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  
}


customElements.define('laat-list-display', LaatListDisplay);
