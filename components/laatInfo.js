export { LaatInfo }
import { isValidID } from "../modules/utils.js"
import { FetchElem } from "./fetchElem.js"

/*
 * Component showing basic info about a laat. Uses functionality from FetchElem
 *
 * Attributes:
 *    id: the id of the laat to be shown
 *
 * Expects children ul.laat-navn, .laat-sjanger and .laat-andre-navn 
 */

class LaatInfo extends FetchElem {

  static attributeNames = ['id', 'set-title'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    this.setupFetchParams();
    this.loadData();
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

    // Deep copy template contents
    let templateContent =
      this.querySelector('template').content.cloneNode(true);

    this.contentTreeBase = document.createElement('div');
    this.contentTreeBase.appendChild(templateContent);

    // Nothing to display yet
    this.displayTree = null;
  }

  setupListeners() {
    this.addEventListener('dataLoad', (e) => {
      this.render();
    });
  }

  setupFetchParams() {
    this.setAttribute('src', '/laater/info');
    this.setAttribute('params', `id=${this.getAttribute('id')}`);
  }

  render(){
    if(this.status === 'error'){
      this.renderError();
    }
    else {
      this.renderContent();
    }
  }

  renderError() {
    this.textContent = 'En feil oppstod i låtinfoelementet: ' + this.data.errorMsg;
  }

  renderContent() {

    let templateCopy = this.contentTreeBase.cloneNode(true);
    
    // Now we look for the children to render text into
    let nameList = templateCopy.querySelector('ul.laat-andre-navn');
    let genereElem = templateCopy.querySelector('.content .laat-sjanger');
    let desctiptionElem = templateCopy.querySelector('.content .description');


    // First all the names
    for (let name of this.data.navn) {
      let newListElem = document.createElement('li');
      newListElem.textContent = name;
      nameList.appendChild(newListElem);
    }


    let descriptionText = "";
    // Then the (maybe multiple) descriptions
    for (let description of this.data.beskrivelser) {
      descriptionText += description + "\n";
    }

    
    
    // Then the genere
    genereElem.textContent = this.data.sjanger;

    
    
    // If nothing is rendered, append new display tree
    // If a rendered tree is already present, replace it
    if (this.displayTree === null) {
      this.displayTree = templateCopy;
      this.appendChild(this.displayTree);
    }
    else {
      this.replaceChild(templateCopy, this.displayTree);
      this.displayTree = templateCopy;
    }
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
    
    if(name === 'id') {
      this.setupFetchParams();
      this.loadData();
    }
  }
}


customElements.define('laat-info', LaatInfo);
