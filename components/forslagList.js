export { ForslagList }
import { DataList } from "./dataList.js"

/*
 * Special version of data list for the forslag view
 */

class ForslagList extends DataList {

  constructor() {
    super();
  }

  // Overwrite normal rendering to be able to set css class corresponding to status
  render(){
     // Copy old top level element (non-recursive, no children are included)
    let newListWrapper = this.listWrapperElem.cloneNode();
    
    // iterate over all displayData, fill templates where class and key match
    for(let forslag of this.displayData) {
      
      // Copy the list item template
      let curListItem = this.listElemWrap.cloneNode(true);
      for(let key in forslag) {
	// Add the text content of the key to a matching node, if found
	let matchingNode = curListItem.querySelector("." + key);
	if(matchingNode !== null) {
	  // Some string handeling when inserting statusbeskrivelse
	  if(key === "statusbeskrivelse") {
	    let firstLetter = forslag[key].charAt(0);
	    let restLetters = forslag[key].slice(1);
	    let newText = firstLetter.toUpperCase() + restLetters + ":";
	    matchingNode.textContent = newText;
	  }
	  else {
	    matchingNode.textContent = forslag[key];
	  }
	}

	// Set status styling if it is specified
	if(key === "statusid") {
	  let forslagStatus = forslag[key];
	  if(forslagStatus === 1) {
	    curListItem.classList.add('status-new');
	  }
	  else if(forslagStatus === 2) {
	    curListItem.classList.add('status-working');
	  }
	  else if(forslagStatus === 3) {
	    curListItem.classList.add('status-finished');
	  }
	}
      }
      
      newListWrapper.appendChild(curListItem);
    }
    
    // Replace old list with new
    this.replaceChild(newListWrapper, this.listWrapperElem);
    this.listWrapperElem = newListWrapper;
  }
  
}


customElements.define('forslag-list', ForslagList);
