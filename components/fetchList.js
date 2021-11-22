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


class FetchList extends HTMLElement {

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.render();

    //this.loadData();
    //this.render();
  }

  static get observedAttributes() {
    return ["src"]
  }

  setupDOM() {
    this.contentWrap = document.createElement('div');
    this.appendChild(this.contentWrap);
    
    this.listWrap = document.createElement('ul');

    this.loadScreen = this.loadScreenTemplate.content.cloneNode(true);
  }

  setupState() {
    console.log(this);
    this.loading = true;
    this.loadScreenUp = false;
    this.listViewUp = false;
    this.listItemTemplate = this.querySelector('template.list-item');
    this.loadScreenTemplate = this.querySelector('template.load-screen');
  }

  // Reads the src attribute (can be set by js or directly in html),
  // and uses apiFetch to try and get data from it
  loadData() {
    this.data = [
      {
	tittel: "Et lite debugeksempel bare",
	forslag: "Hva om dette ikke var hardkoda, men kom fra databasen"
      },
      {
	tittel: "Mer debug",
	forslag: "Rålækkert kis, herre blir en diger hit"
      }
    ]
    this.loading=false;
  }
  
  /* update state when observed attributes change */
  attributeChangedCallback(name, oldValue, newValue) {
  // Only update on actual change
    if(oldValue != newValue) {
      loadData();
    }
  }

  /* Update visual state to match internal state */
  render() {
    console.log("render called with state\n",
		"loading:", this.loading, "\n",
		"loadScreen:", this.loadScreenUp, "\n",
		"listView:", this.listViewUp
    )
    
    if(this.loading === true) {
      if(this.loadScreenUp === false) {
	console.log("set up load screen", this.loadScreen)
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
    
    // iterate over all data, fill templates where class and key match
    for(let forslag of this.data) {

      // Get a new copy of the template
      let curListItem = this.listItemTemplate.content.cloneNode(true);

      for(let key in forslag) {

	// Add the text content of the key to a matching node, if found
	let matchingNode = curListItem.querySelector("." + key);
	if(matchingNode !== null) {
	  matchingNode.textContent = forslag[key];
	}
      }
      
      this.listWrap.appendChild(curListItem);
    }

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
