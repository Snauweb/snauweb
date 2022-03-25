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

  static attributeNames = ['id'];

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

  // Dispatch correct render method based on value of this.status
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
    let headerElem = templateCopy.querySelector('.main-header');
    let nameListDesc = templateCopy.querySelector('.other-names .description');
    let nameList = templateCopy.querySelector('ul.laat-andre-navn');
    let genereElem = templateCopy.querySelector('.content .laat-sjanger');
    let descElem = templateCopy.querySelector('.content .description');


    // First all the names
    // Note that i starts at 1 and not 0. This is
    // because the first name is set as header, and does not need to be
    // repeated

    // First name found goes in header
    let firstName = this.data.navn[0];

    if (firstName === undefined) {
      headerElem.textContent = "Uten navn";
    }
    else {
      headerElem.textContent = firstName;
    }
    
    
    for (let i = 1; i < this.data.navn.length; i++) {
      let newListElem = document.createElement('li');
      let curName = this.data.navn[i];
      newListElem.textContent = curName;
      nameList.appendChild(newListElem);
    }

    // If there is only one (or no) names, there is no point in an
    // "også kjent som" header
    if(this.data.navn.length <= 1) {
      nameListDesc.textContent = "";
    }

    let descriptionText = "";
    // Then the (maybe multiple) descriptions
    for (let description of this.data.beskrivelser) {
      descriptionText += description + "\n";
    }

    // Inner text to make the line breaks work
    descElem.innerText = descriptionText; 
    
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
