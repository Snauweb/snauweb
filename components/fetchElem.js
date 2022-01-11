import { apiFetch } from "../modules/apiFetch.js"
export { FetchElem }


/*
 * Wrapper for component that needs to fetch data from the web
 * Be used as base class for other data driven components 
 * Only performs data load, no visuals.
 * Object properties:
 * state = init | loading | loaded | error
 * data = null | {...}
 *
 * src is relative to api base address defined for apiFetch
 * state and data is accessed by getter functions
 * fetchState() returns state (loading, error etc), fetchData returns data
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
  } 
  
  // Get fetchData from endpoint specified in attribute
  loadData() {
    this.status = "loading"
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

    console.log("Performing fetch from", src, "with method", method, "params", params)

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
      apiFetchParams = {method: "DELETE", credentials: 'include'}
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
