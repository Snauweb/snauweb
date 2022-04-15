export { BrukerInfoList }
import { FetchElem } from "./fetchElem.js";
import { BrukerInfo } from "./brukerInfo.js";

/*
 * Element fetching and showing all information for a user
 *
 * Expects a <template> child of class .list-element that dictates the layout of
 * a given key-value pair found in the user data.
 * The key-value pair is shown in all children of class .key and .value resp.
 *
 * Attributes:
 *     id: "current" | <id>. If set to "current", fetches info for current user,
 *         otheriwse, it fetches for the given id
 */

class BrukerInfoList extends FetchElem {

  static attributeNames = ['id'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    //this.setupListeners();
    //this.configureFetch();
    //this.loadData();
    this.render();
  }

  setupState() {
    // Mock data 'till I get of the train unblock aws sj you cowards
    this.status = 'loaded';
    this.data = {
      id: {
	verdi: 1,
	type: 'tall'
      },

      brukernavn: {
	verdi: 'johala',
	type: 'tekst'
      },

      epost: {
	verdi: 'johan@låfte.no',
	makslengde: 50,
	type: 'tekst'
      }
    }
  }

  setupDOM(){
    let listElementTemplate = this.querySelector('template.list-element');
    let listElementFragment = listElementTemplate.content.cloneNode(true);
    this.listItemBase = document.createElement('li');
    this.listItemBase.appendChild(listElementFragment);
    
    
    this.renderNode = document.createElement('div');
    this.appendChild(this.renderNode);
  }

  setupListeners() {
    this.addEventListener('dataLoad', (e) => {
      console.log("Got data:", this.data)
    });
  }
  
  configureFetch() {
    //TODO
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
    this.renderNode.innerText = 'Laster brukerinfo';
  }

  renderLoaded() {
    const includeKeys =
      ['brukernavn', 'epost']
    
    let newList = this.generateKeyValList(includeKeys);
    this.renderNode.appendChild(newList);
  }

  renderError() {
    this.renderNode.innerText = 'Feil under lasting:' + this.errorMsg; 
  }

  // Fills out a list with data where the key matches an entry in includeKeys
  generateKeyValList(includeKeys) {
    let keyValList = document.createElement('ul');
    
    // Null check
    if(this.data === null) {
      keyValList.textContent = 'Ingenting å vise om denne brukeren';
      return baseListElem;
    }

    for (let key in this.data) {
      let keyInIncludes = (includeKeys.indexOf(key) !== -1);
      if (keyInIncludes) {
	let newListItem = this.listItemBase.cloneNode(true);
	let val = this.data[key].verdi;

	let keyNode = newListItem.querySelector('.key');
	let valNode = newListItem.querySelector('.value');
	
	if(keyNode !== null) {
	  keyNode.textContent = key;
	}

	if(valNode !== null) {
	  valNode.textContent = val;
	}

	keyValList.appendChild(newListItem);
      }
    }

    return keyValList;
  }
  
  
  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return BrukerInfoList.attributeNames; }
  
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


customElements.define('bruker-info-list', BrukerInfoList);
