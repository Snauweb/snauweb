export { BrukerInfo }
import { FetchElem } from "./fetchElem.js";
import {
  isValidID,
  getSingleURLParameter
} from "../modules/utils.js";

/*
 * Element combining an list view and an edit view of a user
 * Expects
 *     One <template> child of class '.list-view' containing a <bruker-info-list>
 *     One <template> child of class '.list-edit' containing a <bruker-info-edit>
 *
 * Accepts
 *     One <template> child of class '.header' containing a child of class '.page-title'
 *     the text content of the 
 *
 * Attributes:
 *     id: 'url' | 'cur' | <id>. Default '1'
 *         'url' means the component looks for an url parameter 'id=<id>'
 *         If no parameter is found in the url, set to 'cur'
 *         'cur' finds info for the current user.
 *         'id' is an explicit id to show info for
 *
 * Properties:
 *     renderState = 'list' | 'edit'. Default 'list'
 *
 */

class BrukerInfo extends FetchElem {

  static attributeNames = ['id'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    //this.configureFetch();
    //this.loadData();
    this.updateChildren();
    this.render();
  }

  setupState() {
    this.renderState = 'list';
    
    // Mock data 'till I get of the train unblock aws sj you cowards
    this.status = 'loaded';
    this.data = {
      id: 1,
      curUserEditor: true
    }

    this.validateParameters();
  }

  validateParameters() {
    const defaultID = '1';
    
    let idParamVal = this.getAttribute('id');

    if(idParamVal === 'url') {
      let IDInURL = getSingleURLParameter('id')
      if (isValidID(IDInURL)) {
	this.setAttribute('id', IDInURL)
      }
      else {
	this.setAttribute('id', 'cur');
      }
    }
    
    else if(idParamVal === null || !isValidID(idParamVal)) {
      this.setAttribute('id', defaultID);
    }
  }

  setupDOM(){
    let brukerInfoFragment = this.querySelector('template.list-view').content;
    let brukerEditFragment = this.querySelector('template.list-edit').content;
    let headerFragment = this.querySelector('template.header').content;
    let controlFragment = this.querySelector('template.control').content;

    this.brukerInfoWrapper = document.createElement('div');
    this.brukerEditWrapper = document.createElement('div');
    
    this.headerWrapper = document.createElement('div');
    this.messageElementWrapper = document.createElement('div');
    this.controlWrapper = document.createElement('div');

    this.renderNode = document.createElement('div');

    this.brukerInfoWrapper.appendChild(brukerInfoFragment);
    this.brukerEditWrapper.appendChild(brukerEditFragment);
    this.headerWrapper.appendChild(headerFragment);
    this.controlWrapper.appendChild(controlFragment);

    this.infoListElementHandle = this.brukerInfoWrapper.querySelector('bruker-info-list');
    this.infoEditElementHandle = this.brukerEditWrapper.querySelector('bruker-info-edit');
    this.toggleButtonElementHandle = this.controlWrapper.querySelector('toggle-button');

    this.appendChild(this.headerWrapper);
    this.appendChild(this.messageElementWrapper);
    this.appendChild(this.renderNode);
    this.appendChild(this.controlWrapper);
  }

  setupListeners() {
    
  }
  
  configureFetch() {
    //TODO
  }

  // If id changes, the id used in the info list and info edit must be updated
  updateChildren() {
    this.infoListElementHandle.setAttribute('id', this.getAttribute('id'));
    this.infoEditElementHandle.setAttribute('id', this.getAttribute('id'));
  }


  // *** Rendering ***
  render(){

    // Clear render node
    this.renderNode.replaceChildren();
    
    if (this.status === 'loading' || this.status === 'init') {
      this.renderLoading();
    }

    else if (this.status === 'loaded') {
      this.renderLoaded();
    }

    else {
      this.renderError();
    }
  }

  renderLoading() {
    this.renderNode.innerText = 'Sjekker autorisasjon...';
  }

  renderLoaded() {
    if (this.renderState === 'list') {
      this.renderNode.appendChild(this.brukerInfoWrapper);
    }

    else if (this.renderState === 'edit') {
      this.renderNode.appendChild(this.brukerEditWrapper);
    }

    else {
      this.renderNode.innerText = 'Ugyldig renderState ' + this.renderState;
    }
  }

  renderError() {
    this.renderNode.innerText = 'Feil under lasting:' + this.errorMsg; 
  }
  
  
  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return BrukerInfo.attributeNames; }
  
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


customElements.define('bruker-info', BrukerInfo);
