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
    this.render();
  }

  static get observedAttributes() {
    return ["src"]
  }

  setupState() {
    this.loading = true;
    this.loadScreenUp = false;
    this.listViewUp = false;
    this.listItemTemplate = this.querySelector('template.list-item');
    this.loadScreenTemplate = this.querySelector('template.load-screen');
    this.data = null; // Internal data
    this.displayData = null; // Data to be displayed
    this.src = null;
  }
 
  
  setupDOM() {
    this.contentWrap = document.createElement('div');
    this.contentWrap.setAttribute("class", "fetch-list-wrapper");
    this.appendChild(this.contentWrap);
    
    this.listWrap = document.createElement('ul');

    // Copy load screen template into object variable for reuse
    this.loadScreen = document.createElement('div');
    this.loadScreen.appendChild(this.loadScreenTemplate.content.cloneNode(true))
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
      this.loadData();
    }
  }

  /* Update visual state to match internal state */
  render() {
    if(this.loading === true) {
      if(this.loadScreenUp === false) {
	this.contentWrap.appendChild(this.loadScreen);
	this.loadScreenUp = true;
      }

      if(this.listViewUp == true) {
	this.contentWrap.removeChild(this.listWrap);
	this.listViewUp = false;
      }
      // If load screen is up, no more rendering needs to be performed
      return;
    }

    // Fill a new list, replace the old one
    let newListWrapper = document.createElement('ul');
    
    // iterate over all data, fill templates where class and key match
    for(let forslag of this.displayData) {
      
      // Get a new copy of the template
      let curListItem = this.listItemTemplate.content.cloneNode(true);

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
    this.listWrap = newListWrapper;

    // Replace load screen with new list view, if needed
    if(this.loadScreenUp === true) {
      this.contentWrap.removeChild(this.loadScreen);
      this.loadScreenUp = false;
    }

    if(this.listViewUp === false) {
      this.contentWrap.appendChild(this.listWrap);
      this.listViewUp = true;
    }
  }
  
  // Boilerplate
  disconnectedCallback() {}
  adoptedCallback() {}
  teardownDOM() {}
}

customElements.define('fetch-list', FetchList);
