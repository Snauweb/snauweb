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
    // Internal state flags
    this.loading = true;
    this.error = false;

    // Render state flags
    this.loadScreenUp = false;
    this.contentViewUp = false;
    this.errorViewUp = false;

    // Data
    this.data = null; // Internal data
    this.displayData = null; // Data to be displayed
    this.errorMsg = null; // Error message to be displayed

    // Path of data relative to api base address given in apiConfig.js
    this.src = null;

    // Content templates for different visual states
    // (list items, load screen, background, error message)
    this.listItemTemplate = this.querySelector('template.list-item');
    this.loadScreenTemplate = this.querySelector('template.load-screen');
    this.backgroundTemplate = this.querySelector('template.background');
    this.errorMsgTemplate = this.querySelector('template.errorMsg');

    // Check for non-defined content templates and replace with defaults 
    this.setupDefaultTemplates();
  }

  setupDefaultTemplates() {
    if(this.listItemTemplate === null) {
      this.listItemTemplate = document.createElement('template');
      this.listItemTemplate.innerHTML = " \
      <li> \
        <span>Data loaded, but no template for list items provided.</span> \
        <br/> \
        <span> \
          Define a template element containing a li element inside the \
          fetch-list element to replace this default message \
        </span> \
      </li> \
      ";
    }

    if(this.loadScreenTemplate === null) {
      this.loadScreenTemplate = document.createElement('template');
      this.loadScreenTemplate.innerHTML = " \
      <div> \
        <span> Loading... </span> \
      </div> \
      ";
    }

    if(this.backgroundTemplate === null) {
      this.backgroundTemplate = document.createElement('template');
      this.backgroundTemplate.innerHTML = " \
      <div></div> \
      ";
    }

    if(this.errorMsgTemplate === null) {
      this.errorMsgTemplate = document.createElement('template');
      this.errorMsgTemplate.innerHTML = " \
      <div> \
        <span class=\"errorMsg\"></span> \
      </div> \
      ";
    }
  }
  
  // Prepare the different DOM elements making up the list
  // * fetchListWrap <div>: conatinins all content
  // ** loadScreen <div>: when loading, this is the only child of fetchListWrap
  // ** errorWrap <div>: on API error, this is the only child of fetchListWrap
  // ** contentWrap <div>: when displaying data, this is the only child of fetchListWrap
  // *** background <div>: the only child of contentWrap
  // **** listWrap <ol>: The list of items
  // ***** listItemElem <li>: The wrapper for a given item
  setupDOM() {
    // Define base elements
    this.fetchListWrap = document.createElement('div');
    this.loadScreenWrap = document.createElement('div');
    this.contentWrap = document.createElement('div');
    this.errorWrap = document.createElement('div');
    this.listWrap = document.createElement('ol');
    this.listItemElem = undefined;

    // Transfer template content over to base elements
    // The template content is a documentFragment that is emptied when
    // used with Element.appendChild. To make it persistent, we append
    // it into a normal DOM element, and use this as blueprint for whenever it is needed
    this.loadScreen = this.loadScreenTemplate.content.cloneNode(true)
			  .querySelector('div');
    this.contentWrap = this.backgroundTemplate.content.cloneNode(true)
			   .querySelector('div');
    this.listItemElem = this.listItemTemplate.content.cloneNode(true)
			    .querySelector('li');

    this.errorWrap.appendChild(this.errorMsgTemplate.content.cloneNode(true));
    
    // Glue elements together, start state is loading
    this.fetchListWrap.appendChild(this.loadScreen);
    this.contentWrap.appendChild(this.listWrap);

    // Add to parent root node (the fetch-list itself)
    this.appendChild(this.fetchListWrap);
  }

  // Reads the src attribute (can be set by js or directly in html),
  // and uses apiFetch to try and get data from it.
  // Renders at the end to put up the load screen,
  // the callback sets loading to false and rerenders to get rid of it
  loadData() {
    this.loading = true;
    apiFetch(this.getAttribute('src'))
      .then(response => {
        let status = response.status;
        if(parseInt(status) >= 400) {
	  this.error = true;
	}
	else {
	  this.error = false;
	}
	
	return response.json()
      })
      .then( data => {
	// If the API responded wiht an error, we want to display it
	if(this.error === true) {
	  this.errorMsg = "";
	  for (let key in data) {
	    this.errorMsg += (key.toString() + ": " + data[key].toString() + "\n");
	  }
	}

	// If the response was not an error, prepare to display the data as a list
	else {
	  this.error = false;

	  // If the data is not iterable, wrap it in a list
	  if(typeof data[Symbol.iterator] === 'function')
	    this.data = data;
	  else
	    this.data = [data];
	  
	  this.displayData = this.data;
	}

	this.loading = false;
	this.render();
      })
      .catch((error) => {
	console.error('apiFetch error in fetchList:', error);
	this.loading = false;
	this.error = true;
	this.errorMsg = 'apiFetch error in fetchList:' + error;
	this.render();
      });
    this.render()
  }
  
  /* update state when observed attributes change */
  attributeChangedCallback(name, oldValue, newValue) {
  // Only update on actual change
    if(oldValue != newValue) {
      // If src is changed, we try to load data from the new value
      if(name === "src") {
	this.loadData();
      }
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

      if(this.errorViewUp === true) {
	this.fetchListWrap.removeChild(this.errorWrap);
	this.errorViewUp = false;
      }
      // If load screen is up, no more rendering needs to be performed
      return;
    }

    // Are we in an error state? In that case, render error screen
    if(this.error === true) {

      // We must communicate the error by rendering it
      // First, make sure error message is actually set
      if(this.errorMsg === null) {
	this.errorMsg = "Error in the error handling of fetch-list! Error message was null";
      }
      
      // look for element of class errorMsg. If not found, just add directly
      let errorMessageElem = this.errorWrap.querySelector('errorMsg');
      if(errorMessageElem !== null) {
	errorMessageElem.textContent = this.errorMsg;
      }
      else {
	this.errorWrap.textContent = this.errorMsg;
      }
      
      if(this.loadScreenUp === true) {
	this.fetchListWrap.removeChild(this.loadScreen);
	this.loadScreenUp = false;
      }

      if(this.contentViewUp === true) {
	this.fetchListWrap.removeChild(this.contentWrap);
	this.contentViewUp = false;
      }

      if(this.errorViewUp === false) {
	this.fetchListWrap.appendChild(this.errorWrap);
	this.errorViewUp = true;
      }
      
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

    // Replace load screen if needed
    if(this.loadScreenUp === true) {
      this.fetchListWrap.removeChild(this.loadScreen);
      this.loadScreenUp = false;
    }

    // Remove error message if needed
    if(this.errorViewUp === true) {
      this.fetchListWrap.removeChild(this.errorWrap);
      this.errorViewUp = false;
    }

    // Make the rendered data visible
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
