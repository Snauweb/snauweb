export { RecordingList }
import { FetchElem } from './fetchElem.js'
import { isValidID } from '../modules/utils.js'
import { assetConfig } from '../config/assetConfig.js'

/*
 * List of recordings associated with a given melody id
 * Creates an internal fetchElem to fetch data
 * Does not rely on data list, as the list shows more than just textual data
 * Attributes:
 *    id: the id of the melody to show recordings for. Defults to 1
 *    src: api endpoint
 *
 * Has a "state" field. This has one of three values: "loading" | "loaded" | "error"
 * Expects a <template> of class .listElement
 */

class RecordingList extends HTMLElement { 

  static attributeNames = ['id', 'src']
  
  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    this.loadData();
  }

  setupState() {
    this.loadConfigSettings();
    this.validateAttributes();
    this.recordingData = null;
    this.status = "loading";
    // optionally contains an error message if this.status is "error"
    this.errorMsg = ""; 
  }

  loadConfigSettings() {
    this.recordingsDir = assetConfig.recordingsDir;
  }
  
  validateAttributes() {
    const default_id = '1';
    const default_src = '/laater/recordings';
    
    // The id attribute must exist and it must be a valid id number
    if (!this.hasAttribute('id')) {
      this.setAttribute('id', default_id);
    }
    else if (!isValidID(this.getAttribute('id'))) {
      this.setAttribute('id', default_id);
    }

    // The src attribute must exist, but it beeing a valid url is the users
    // responsebility
    if (!this.hasAttribute('src')) {
      this.setAttribute('src', default_src);
    }
  }

  
  // Initialise DOM elements needed for rendering
  setupDOM(){

    // fetch-elem to perform the fetching for us
    this.fetcherElem = document.createElement('fetch-elem');
    this.fetcherElem.setAttribute('src', this.getAttribute('src'));
    this.fetcherElem.setAttribute('params', 'id=' + this.getAttribute('id'));

    // Get the provided template and store the document fragment within
    let template = this.querySelector('template.list-element');
    this.listFragment = template.content; // the document fragment

    // Other wrapper elements
    this.contentWrapper = document.createElement('div');
    this.appendChild(this.contentWrapper);
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
    this.fetcherElem.loadData();
  }
  
  // **** RENDERING

  // Dispatches correct rendering method based this.status
  render() {
    console.log("rendering with status", this.status)
    
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
    let outerListElement = document.createElement('ul');
    let recordingsList = this.recordingData.recordings;
    
    for (let recordingData of recordingsList) {
      let recordingDirRoot = assetConfig.recordingsDir;
      console.log('recording dir root', recordingDirRoot);
      console.log('filename', recordingData.filnavn);
      
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
  }
}


customElements.define('recording-list', RecordingList);

