export { SheetMusicSelect }

import { isValidID } from '../modules/utils.js'
import { FetchElem } from './fetchElem.js'


/*
 * Component that allows the user to select and display the sheet music associated
 * with a laat in the snau database
 * 
 * Attributes:
 *     id: The id of the song to display
 *     src: The path to the api endpoint, relative to the api root
 *     asset-dir: The directory containing sheet music files such as pdf
 */

class SheetMusicSelect extends HTMLElement {
  
  // Replace these with the attributes you wish to listen to changes for
  static attributeNames = ['id', 'src', 'asset-dir'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    this.configureFetch();
    this.updateChildren();
    this.loadData();
  }

  setupState() {
    this.validateAttributes();
    this.displayData = null;
    this.curDisplayFormat = 'pdf';
    this.curFileName = 'dårligpolsen.pdf'
  }
  
  validateAttributes() {
    const defaultID = '1';
    const defaultSrc = '/';
    const defaultDir = '/assets';

    // id
    if(!this.hasAttribute('id')) {
      this.setAttribute('id', defaultID);
    }
    else if(!isValidID(this.getAttribute('id'))){
      this.setAttribute('id', defaultID);
    }

    // src
    if(!this.hasAttribute('src')) {
      this.setAttribute('src', defaultSrc);
    }

    // asset-dir
    if(!this.hasAttribute('asset-dir')) {
      this.setAttribute('asset-dir', defaultDir);
    }
  }

  // Propagate attribute changes down to children
  updateChildren() {
    this.viewElem.setAttribute('format', this.curDisplayFormat);
    let fullURL =
      this.getAttribute('asset-dir') + '/' + this.curFileName;
    this.viewElem.setAttribute('url', fullURL);
  }
      
      configureFetch() {
    this.fetchElem.setAttribute('src', this.getAttribute('src'));
    this.fetchElem.setAttribute('params', 'id=' + this.getAttribute('id'));
  }
  
  setupDOM(){
    this.filterElem = this.querySelector('sheet-music-select-controller');
    this.viewElem = this.querySelector('sheet-music-view');
    this.fetchElem = document.createElement('fetch-elem');

    console.log('fetch elem:', this.fetchElem);
  }

  setupListeners() {
    this.fetchElem.addEventListener('dataLoad', (e) => {
      console.log("The sheet music select just loaded the data",
		  this.fetchElem.data)
      this.displayData = this.fetchElem.data;
    });

    this.filterElem.addEventListener('stateChange', (e) => {
      console.log("State change in filter element");
    });
  }

  loadData() {
    this.fetchElem.loadData();
  }
  
  render(){}

  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return SheetMusicSelect.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue === newValue) {
      return;
    }

    console.log("new attrib in sheet music select!:", name, "=", newValue);
    
    this.validateAttributes();
    this.updateChildren();
  }
}


customElements.define('sheet-music-select', SheetMusicSelect);

