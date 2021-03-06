import { apiFetch } from "../modules/apiFetch.js"
export { FetchElem }


/*
 * Wrapper for component that fetches data from the web
 * Can be used as base class for other data driven components, or as sub-element
 * Only performs data load, no visual functionality.
 * Object properties:
 * status = init | loading | loaded | error
 * data = null | {...}
 * errorMsg = <String>
 *
 * loadData() triggers data load with current settings
 *
 * src is relative to api base address defined for apiFetch
 * 
 * emits a loadStart event when loading begins, and a dataLoad event when data is loaded
 */
class FetchElem extends HTMLElement {

  static attributeNames = ['src', 'params', 'method', 'payload'];
  
  constructor() {
    super();
    this.setupFetchElemState();
  }

  // Common patterns
  setupFetchElemState() {
    this.data = null;
    this.status = "init";
    this.errorMsg = "";
  } 
  
  // Get fetchData from endpoint specified in attribute
  loadData() {

    this.status = "loading"
    // Signal to any listeners that load has started
    const fetchDataLoadingEvent = new CustomEvent("loadStart");
    this.dispatchEvent(fetchDataLoadingEvent);
    
    let src = this.getAttribute("src");
    if(src === null) {
      src = ""; // null is interpreted as ""
      this.setAttribute("src", "");
    }

    let params = this.getAttribute("params");
    if(params === null) {
      params = ""; // null is interpreted as ""
      this.setAttribute("params", "");
    }

    let method = this.getAttribute("method");
    if(method === null) {
      method = "GET"; // null is interpreted as ""
      this.setAttribute("method", "GET");
    }

    let payload = this.getAttribute("payload");
    if(payload === null) {
      payload = "{}"; // null is interpreted as {} for the payload
      this.setAttribute("payload", "{}");
    }

    let apiFetchParams = {};
    if(method === "GET") {
      apiFetchParams = {method: "GET", credentials: 'include'}
    }
    else if(method === "POST") {
      apiFetchParams = {
	method: "POST",
	credentials: 'include',
	body: payload
      }
    }
    else if(method === "DELETE")  {
      apiFetchParams = {method: "DELETE", credentials: 'include'};
    }
    else if(method === "PUT") {
      apiFetchParams = {
	method: "PUT",
	credentials: 'include',
	body: payload,
	headers: {
	  'Content-Length': payload.length,
	  'Content-Type': 'application/json'
	}
      };
    }
    
    apiFetch(src+"?"+params, apiFetchParams)
      .then(response => {
	let status = response.status;
	if(parseInt(status) >= 400) {
	  this.status = "error";
	}
	else {
	  this.status = "loaded";
	}
	return response.json();
      })
      .then(data => {
	this.data = data;

	// The errorMsg property indicates an error
	if(data.hasOwnProperty('errorMsg')) {
	  this.status = "error";
	  this.errorMsg = data.errorMsg;
	}
	// Emit a stateChange event. Listening objects now know
	// that the data loading is complete
	const fetchDataLoadedEvent = new CustomEvent("dataLoad", {
	  detail: {
	    fetchStatus: this.status,
	    method: this.getAttribute('method')
	  }
	});
	this.dispatchEvent(fetchDataLoadedEvent);
      })
      .catch(error => {
	if(error.name === "SyntaxError") {
	  // If endpoint does not return data, set it to null
	  this.data = null;
	}
	// Emit a stateChange event. Listening objects now know
	// that the data loading is complete
	const fetchDataLoadedEvent = new CustomEvent("stateChange", {
	  detail: {
	    fetchStatus: this.status,
	    method: this.getAttribute('method')
	  }
	});
	this.dispatchEvent(fetchDataLoadedEvent);
      })
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
