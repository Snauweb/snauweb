/*
 * Generic webComponent for a list that shows data from the API
 * To use, create the element in the HTML file, and provide a template
 * as a child. This template decides the look of a single list item.
 * When fetching data from the endpoint, the list looks for elements in
 * the template with classname identical to data value key name.
 * If a match is found, the matching element is filled with the data of the matching key
 *
 * Attributes:
 *     src: API endpoint to fetch data from. Relative to the base adress provided
 *     in APIconf.json
 */

export { FetchList }
import { apiFetch } from "../modules/apiFetch.js"

class FetchList extends HTMLElement {

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.render();

    this.loadData();
    //this.render();
  }

  static get observedAttributes() {
    return ["src"]
  }

  setupState() {
    this.loading = true;
    this.loadScreenUp = false;
    this.contentViewUp = false;
    this.listItemTemplate = this.querySelector('template.list-item');
    this.loadScreenTemplate = this.querySelector('template.load-screen');
    this.backgroundTemplate = this.querySelector('template.background');
    this.data = null; // Internal data
    this.displayData = null; // Data to be displayed
    this.src = null;
  }
 
  // Prepare the different DOM elements making up the list
  // * fetchListWrap <div>: conatinins all content
  // ** loadScreen <div>: when loading, this is the only child of fetchListWrap
  // ** contentWrap <div>: when displaying data, this is the only child of fetchListWrap
  // *** background <div>: the only child of contentWrap
  // **** listWrap <ol>: The list of items
  // ***** listItemElem <li>: The wrapper for a given item
  setupDOM() {
    // Define base elements
    this.fetchListWrap = document.createElement('div');
    this.loadScreenWrap = document.createElement('div');
    this.contentWrap = document.createElement('div'); 
    this.listWrap = document.createElement('ol');
    this.listItemElem = undefined;

    // Transfer template content over to base elements
    this.loadScreen = this.loadScreenTemplate.content.cloneNode(true)
			  .querySelector('div');
    this.contentWrap = this.backgroundTemplate.content.cloneNode(true)
			   .querySelector('div');
    this.listItemElem = this.listItemTemplate.content.cloneNode(true)
			    .querySelector('li');
    
    // Glue elements together, start state is loading
    this.fetchListWrap.appendChild(this.loadScreen);
    this.contentWrap.appendChild(this.listWrap);

    // Add to parent node
    this.appendChild(this.fetchListWrap);
  }

  // Reads the src attribute (can be set by js or directly in html),
  // and uses apiFetch to try and get data from it.
  // Renders at the end to put up the load screen,
  // the callback sets loading to false and rerenders to get rid of it
  loadData() {
    this.loading = true;
    apiFetch(this.getAttribute('src'))
      .then(response => response.json())
      .then((data) =>{
	this.data = data;
	this.displayData = this.data;
	this.loading = false;
	this.render();
      })
      .catch((error) => {
	console.error('apiFetch error in fetchList:', error);
      });
    this.render()
  }
  
  /* update state when observed attributes change */
  attributeChangedCallback(name, oldValue, newValue) {
  // Only update on actual change
    if(oldValue != newValue) {
      //this.loadData();
    }
  }

  /* Update visual state to match internal state */
  render() {
    
    if(this.loading === true) {
      if(this.loadScreenUp === false) {
	this.fetchListWrap.appendChild(this.loadScreen);
	this.loadScreenUp = true;
      }

      if(this.contentViewUp === true) {
	this.fetchListWrap.removeChild(this.contentWrap);
	this.contentViewUp = false;
      }
      // If load screen is up, no more rendering needs to be performed
      return;
    }

    // Copy old top level element (non-recursive, no children are included)
    let newListWrapper = this.listWrap.cloneNode();
    
    // iterate over all displayData, fill templates where class and key match
    for(let forslag of this.displayData) {
      
      // Copy the list item template
      let curListItem = this.listItemElem.cloneNode(true);

      for(let key in forslag) {
	// Add the text content of the key to a matching node, if found
	let matchingNode = curListItem.querySelector("." + key);
	if(matchingNode !== null) {
	  matchingNode.textContent = forslag[key];
	}
      }
      
      newListWrapper.appendChild(curListItem);
    }
    
    // Replace old list with new
    this.contentWrap.replaceChild(newListWrapper, this.listWrap);
    this.listWrap = newListWrapper;

    // Replace load screen with new list view, if needed
    if(this.loadScreenUp === true) {
      this.fetchListWrap.removeChild(this.loadScreen);
      this.loadScreenUp = false;
    }

    if(this.contentViewUp === false) {
      this.fetchListWrap.appendChild(this.contentWrap);
      this.contentViewUp = true;
    }
  }
  
  // Boilerplate
  disconnectedCallback() {}
  adoptedCallback() {}
  teardownDOM() {}
}

customElements.define('fetch-list', FetchList);
