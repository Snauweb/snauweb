export { ForslagList }
import { DataList } from "./dataList.js"

/*
 * Special version of data list for the forslag view
 * Overwrites render()
 */

class ForslagList extends DataList {

  constructor() {
    super();
  }

  // Overwrite normal rendering logic of DataList
  // This is needed for custom styles and such based on data.
  // Base DataList does only provide text content
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

	// Initialise reaction counter by passing forslagid
	if(key === "forslagid") {
	  let curReactionElemHandle = curListItem.querySelector('reaction-elem');
	  curReactionElemHandle.setAttribute('forslagid', forslag[key]);
	}

	// Set visual state of reaction counter. Also, make it visible
	if(key === "num_reaksjoner") {
	  let curReactionElemHandle = curListItem.querySelector('reaction-elem');
	  curReactionElemHandle.style.display = "flex";
	  curReactionElemHandle.setCount(forslag[key]);
	}

	if(key === "cur_user_reacted") {
	  let curReactionElemHandle = curListItem.querySelector('reaction-elem');
	  curReactionElemHandle.setToggle(Boolean(forslag[key]))
	}


	// Setup action button and show it if the current user has delete rights
	if(key === "cur_user_deleter") {
	  let curActionButton = curListItem.querySelector('action-button.delete-forslag')
	  if(forslag[key] === true) {
	    curActionButton.setAttribute("params", "id="+forslag["forslagid"])
	    curActionButton.addEventListener("actionClick", (e)=>{
	      const stateChangeEvent = new CustomEvent("stateChange", {
		detail: {
		  action: "delete forslag",
		  id: forslag["forslagid"]
		}
	      });
	      this.dispatchEvent(stateChangeEvent);
	    });
	    curActionButton.removeAttribute('hidden');
	  }
	  else {
	    curActionButton.setAttribute('hidden', true);
	  }
	}

	// Set up and display the forslag status radio buttons,
	// if the current user has the right
	if(key === "cur_user_editor") {
	  let forslagStatusSelect =
	    curListItem.querySelector('forslag-status-selection');

	  if(forslag["cur_user_editor"] === true) {
	    let curForslagStatus = forslag["statusid"];
	    forslagStatusSelect.setAttribute('state', curForslagStatus-1);
	    forslagStatusSelect.setAttribute('forslagid', forslag["forslagid"])

	    // Listen for when the menu does something
	    forslagStatusSelect.addEventListener("actionClick", (e)=>{
	      const stateChangeEvent = new CustomEvent("stateChange", {
		detail: {
		  action: "update forslag state",
		  state: e.detail.newState
		}
	      });
	      this.dispatchEvent(stateChangeEvent);
	    });
	    
	    // Reveal element
	    forslagStatusSelect.style.display = "inline";
	  }

	  else {
	    // Hide element
	    forslagStatusSelect.style.display = "none";
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
