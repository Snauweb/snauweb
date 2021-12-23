import { apiFetch } from "../modules/apiFetch.js"
export { FetchElem }


/*
 * Wrapper for component that needs to fetch data from the web
 * Be used as base class for other data driven components 
 * Only performs data load, no visuals.
 * Object properties:
 * state = loading | loaded | error
 * data = null | {...}
 *
 * src is relative to api base address defined for apiFetch
 */
class FetchElem extends HTMLElement {

  static attributeNames = ['src'];
  
  constructor() {
    super();
  }

  // Common patterns
  setupState() {
    this.data = null;
    this.state = "loading";
  }

  // Get data from endpoint specified in attribute
  loadData() {
    let src = this.getAttribute("src");
    if(src === null) {
      src = ""; // null is interpreted as ""
      this.setAttribute("src", "");
    }

    console.log("fetching from", src)
    apiFetch(src)
      .then(response => {
	let status = response.status;
	if(parseInt(status) >= 400) {
	  this.status = "error";
	}
	return response.json();
      })
      .then(data => {
	this.data = data;
	// Emit a stateChange event. Listening objects now know
	// that the data loading is complete
	const dataLoadedEvent = new CustomEvent("stateChange", {
	  detail: {
	    state: this.state
	  }
	});
	this.dispatchEvent(dataLoadedEvent);
	console.log("The data loaded in fetchElem:", this.data);
      });
  }
  

  // Built-ins

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return FetchElem.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // No automatic data reload for change in src, use explict call to loadData
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('fetch-elem', FetchElem);
