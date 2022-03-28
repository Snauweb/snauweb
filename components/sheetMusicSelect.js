export { SheetMusicSelect }

import { isValidID, pruneFileExtension } from '../modules/utils.js'
import { FetchElem } from './fetchElem.js'


/*
 * Component that allows the user to select and display the sheet music associated
 * with a laat in the snau database
 * 
 * Attributes:
 *     id: The id of the song to display
 *     src: The path to the api endpoint, relative to the api root
 *     asset-dir: The directory containing sheet music files such as pdf
 * 
 * Expects content defined in a template. Uses the first <template> child found
 */

class SheetMusicSelect extends HTMLElement {
  
  static attributeNames = ['id', 'src', 'asset-dir'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    this.configureFetch();
    this.loadData();
  }

  setupState() {
    this.validateAttributes();

    // Explicit null values. None of these should be used before set
    this.displayData = null;
    this.curDisplayFormat = null;
    this.curFileName = null;
    this.curFileDescription;

    // Render a loading screen untill data is loaded, and while data is loading
    this.loading = true;
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
  
  configureFetch() {
    this.fetchElem.setAttribute('src', this.getAttribute('src'));
    this.fetchElem.setAttribute('params', 'id=' + this.getAttribute('id'));
  }
  
  setupDOM() {

    let contentFragment = this.querySelector('template').content;
    this.contentTree = document.createElement('div');
    this.contentTree.appendChild(contentFragment)

    
    this.contentWrapper = document.createElement('div');
    this.appendChild(this.contentWrapper);

    console.log("the content tree after transplantation", this.contentTree)
    
    this.filterElem = this.contentTree.querySelector('filter-control');
    this.viewElem = this.contentTree.querySelector('sheet-music-view');
    this.fetchElem = document.createElement('fetch-elem');

    // Clear drop-down
    let internalSelectElem = this.filterElem.querySelector('select');
    internalSelectElem.replaceChildren();
    
  }

  setupListeners() {
    this.fetchElem.addEventListener('dataLoad', (e) => {
      console.log("The sheet music select just loaded the data",
		  this.fetchElem.data)
      this.displayData = this.fetchElem.data;

      this.selectItem(0); // After loading, select first piece of sheet music
      this.generateNewSelectMenu(); // new data means new selection of sheet music
      this.updateContentTree();

      this.loading = false;
      this.render();
    });

    this.fetchElem.addEventListener('loadStart', (e) => {
      this.loading = true;
      this.render();
    });


    this.filterElem.addEventListener('stateChange', (e) => {
      let filters = e.detail.newState;
      console.log(filters)
      
      for (let filter of filters) {
	console.log("Filter:", filter)
	// If the sheet selector changed, update
	if(filter.filterName === 'notevalg') {
	  let newOptionIndex = filter.elemState;
	  this.selectItem(newOptionIndex);
	  console.log("selected", newOptionIndex);
	}
      }

      this.updateContentTree()
      this.render();
      
    });

    console.log("the filter element:", this.filterElem)
  }
  
  // Select the item in the select list at index itemIndex
  selectItem(itemIndex) {
    // Ensure input is an integer, converting it from string if needed
    itemIndex = parseInt(itemIndex);
    // No point trying to make state a non-number
    if(isNaN(itemIndex)) {
      return
    }
    
    let numSheets = this.displayData.sheets.length;
    if(numSheets === 0) {
      return; // Can's select a sheet if there are none
    }
    
    let clampedIndex = this.clampIndex(itemIndex, 0, numSheets);    
    let selectedSheetData = this.displayData.sheets[clampedIndex];
    
    this.curDisplayFormat = selectedSheetData.format; // Hard coded for now
    this.curFileName = selectedSheetData.filnavn;
    this.curFileDescription = selectedSheetData.beskrivelse;
  }

  clampIndex(index, min, numItems) {    
    let newIndex = index;

    if (index >= numItems) {
      newIndex = numItems-1; // 0-indexed
    }
    else if (index < min) {
      newIndex = min;
    }

    return newIndex;
  }
  
  loadData() {
    this.fetchElem.loadData();
  }
  
  render(){
    // Clear
    this.contentWrapper.replaceChildren();

    if(this.loading) {
      this.renderLoading();
    }
    else {
      this.renderContent();
    }
  }

  renderLoading() {
    this.contentWrapper.innerText = 'Laster noter...'
  }

  renderContent() {
    // If no sheet music, render empty view
    if(this.displayData.sheets.length === 0) {
      this.contentWrapper.innerText = 'Fant ingen noter til denne låta';
    }

    else {
      this.contentWrapper.appendChild(this.contentTree);
    }
  }

  generateNewSelectMenu() {
    // Create options in select
    let selectElement = this.contentTree.querySelector('select');
    selectElement.replaceChildren(); // clear old options
    
    for (let sheetData of this.displayData.sheets) {
      let newOptionElem = document.createElement('option');
      let prunedFileName = pruneFileExtension(sheetData.filnavn);
      
      newOptionElem.textContent = prunedFileName;
      newOptionElem.setAttribute('value', prunedFileName);
      selectElement.appendChild(newOptionElem);
    }
  }
  
  updateContentTree() {
    // Update parameters in pdf-viewer
    this.viewElem.setAttribute('format', this.curDisplayFormat);
    let fullURL =
      this.getAttribute('asset-dir') + '/' + this.curFileName;
    this.viewElem.setAttribute('url', fullURL);
  }
  
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
  }
}


customElements.define('sheet-music-select', SheetMusicSelect);

