export { LaatInfo }
import { isValidID } from "../modules/utils.js"
import { FetchElem } from "./fetchElem.js"

/*
 * Component showing basic info about a laat. Uses functionality from FetchElem
 *
 * Attributes:
 *    id: the id of the laat to be shown
 *    set-title: if set (at all), the component tries to set the textContent
 *               of a DOM node within the <header> element with a matching
 *               class name
 *
 * Expects children ul.laat-navn, .laat-sjanger and .laat-andre-navn 
 */

class LaatInfo extends FetchElem {

  static attributeNames = ['id', 'set-title'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
  }

  setupState() {
    // If ID is not specified or is invalid, set to 1
    if(!this.hasAttribute('id')) {
      this.setAttribute('id', '1');
    }

    if(this.hasAttribute('id') && !isValidID(this.getAttribute('id'))) {
      this.setAttribute('id', '1');
    }
  }

  setupDOM(){
    if(this.hasAttribute('set-title')) {
      // Construct selector query based on attribute
      this.titleElem =
	document.querySelector('header .' + this.getAttribute('set-title'));
    }
    else {
      // No title element is a valid state
      this.titleElem = null;
    }

    // Now we look for the children to render text into
    this.nameElem = this.querySelector('.laat-navn');
    this.nameList = this.querySelector('ul.laat-andre-navn');
    this.genereElem = this.querySelector('.laat-sjanger');
  }

  setupListeners() {
    this.addEventListener('dataLoad', (e) => {
      
    });
  }
  
  render(){
    
  }

  update(){}

  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return LaatInfo.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {
     if(oldValue === newValue) {
       return;
     }
  }
}


customElements.define('laat-info', LaatInfo);
