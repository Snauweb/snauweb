export { LaatListDisplay }
import { DataList } from "./dataList.js"

class LaatListDisplay extends DataList {

  constructor() {
    super();
    this.render();
  }

  // Overwrite DataList implementation
  render() {
    // Copy old top level element (non-recursive, no children are included)
    let newListWrapper = this.listWrapperElem.cloneNode();
    
    // iterate over all displayData objects
    for(let dataObj of this.displayData) {
      
      // Copy the list item template
      let curListItem = this.listElemWrap.cloneNode(true);

      // First we set up the title link
      let titleElem = curListItem.querySelector(".navn");
      let laatLinkElem = document.createElement("a");

      laatLinkElem.setAttribute("href", dataObj["URL"]);
      laatLinkElem.textContent = dataObj["navn"];
      
      titleElem.appendChild(laatLinkElem);

      // Then the genere in parentheses
      let genereElem = curListItem.querySelector(".sjanger");
      genereElem.textContent = "(" + dataObj["sjanger"] + ")";

      // Add to full list
      newListWrapper.appendChild(curListItem);
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
