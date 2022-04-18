export { RecordingList }
import { FetchElem } from './fetchElem.js'
import { isValidID } from '../modules/utils.js'

/*
 * List of recordings associated with a given melody id
 * Creates an internal fetchElem to fetch data
 * Does not rely on data list, as the list shows more than just textual data
 * Attributes:
 *    id: the id of the melody to show recordings for. Defults to 1
 *    src: api endpoint
 *    asset-dir: directory containing recordings relative to web root
 * Has a "state" field. This has one of three values: "loading" | "loaded" | "error"
 * Expects a <template> of class .listElement
 */

class RecordingList extends HTMLElement { 

  static attributeNames = ['id', 'src', 'asset-dir']
  
  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    this.loadData();
  }

  setupState() {
    this.validateAttributes();
    this.recordingData = null;
    this.status = "loading";
    // optionally contains an error message if this.status is "error"
    this.errorMsg = ""; 
  }

  validateAttributes() {
    const DEFAULT_ID = '1';
    const DEFAULT_SRC = '/laater/recordings';
    const DEFAULT_DIR = '/assets/'
    
    // The id attribute must exist and it must be a valid id number
    if (!this.hasAttribute('id')) {
      this.setAttribute('id', DEFAULT_ID);
    }
    else if (!isValidID(this.getAttribute('id'))) {
      this.setAttribute('id', DEFAULT_ID);
    }

    // The src attribute must exist, but it beeing a valid url is the users
    // responsebility
    if (!this.hasAttribute('src')) {
      this.setAttribute('src', DEFAULT_SRC);
    }

    if (!this.hasAttribute('asset-dir')) {
      this.setAttribute('asset-dir', DEFAULT_DIR);
    }
  }

  
  // Initialise DOM elements needed for rendering
  setupDOM(){
    
    // fetch-elem to perform the fetching for us
    this.fetcherElem = document.createElement('fetch-elem');

    this.configureFetcherElem();
    // Get the provided template and store the document fragment within
    let template = this.querySelector('template.list-element');
    this.listFragment = template.content; // the document fragment

    // Other wrapper elements
    this.contentWrapper = document.createElement('div');
    this.appendChild(this.contentWrapper);
  }

  configureFetcherElem() {
    this.fetcherElem.setAttribute('src', this.getAttribute('src'));
    this.fetcherElem.setAttribute('params', 'id=' + this.getAttribute('id'));
  }

  
  setupListeners() {
    this.fetcherElem.addEventListener('dataLoad', (e) => {
      this.recordingData = this.fetcherElem.data;
      let fetchStatus = this.fetcherElem.status;
      
      if (
	fetchStatus === 'loaded' ||
	fetchStatus === 'init'
      ) {
	this.status = 'loaded';
      }

      else if (fetchStatus === 'loading') {
	this.status = 'loading';
      }
      
      else if (fetchStatus === 'error') {
	this.status = 'error';
	this.errorMsg = 'there was an error during data fetch'
      }

      this.render();
    });
  }

  loadData() {
    this.configureFetcherElem();
    this.fetcherElem.loadData();
  }
  
  // **** RENDERING

  // Dispatches correct rendering method based this.status
  render() {
    
    // Wipe current rendered content, by replacing all children with nothing
    this.contentWrapper.replaceChildren();
    
    if(this.status === 'loading') {
      this.renderLoading();
    }

    else if(this.status === 'loaded') {
      this.renderLoaded();
    }

    else if(this.status === 'error') {
      this.renderError();
    }

    else {
      this.renderInvalidState();
    }
  }
  
  renderLoading() {
    this.contentWrapper.textContent = 'Laster inn opptak...';
  }

  renderLoaded() {
    let recordingsList = this.recordingData.recordings;

    if(recordingsList.length === 0) {
      this.contentWrapper.textContent = 'Denne låta har ingen opptak';
      return;
    }

    let outerListElement = document.createElement('ul');
    
    for (let recordingData of recordingsList) {
      let recordingDirRoot = this.getAttribute('asset-dir');      
      let recordingFileLocation = recordingDirRoot + '/' + recordingData.filnavn;
      
      let curWorkingFragment = this.listFragment.cloneNode(true);
      
      let descriptionElem = curWorkingFragment.querySelector('.description');
      descriptionElem.textContent = recordingData.beskrivelse;

      let downloadLinkElem = curWorkingFragment.querySelector('.download a')
      downloadLinkElem.setAttribute('href', recordingFileLocation);

      let audioElem = curWorkingFragment.querySelector('audio');
      audioElem.setAttribute('src', recordingFileLocation);
      
      outerListElement.appendChild(curWorkingFragment);
    }

    this.contentWrapper.appendChild(outerListElement);
  }

  renderError() {
    this.contentWrapper.textContent = 'Error: ' + this.errorMsg;
  }

  renderInvalidState() {
    this.contentWrapper.textContent = 'Invalid component status ' + this.status;
  }
  
  // **** BUILT-INS ****
  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return RecordingList.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue === newValue) {
       return;
    }

    this.validateAttributes();
    this.loadData();
  }
}


customElements.define('recording-list', RecordingList);

