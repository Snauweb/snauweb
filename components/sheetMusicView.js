export { SheetMusicView }
import { isValidID } from '../modules/utils.js'

/*
 * The view for sheet music
 * Initially only pdf, later maybe abc?
 * Attributes:
 *     url: url of file to display
 *     format: pdf or abc
 *
 * Expects a <template> as child containing an <iframe>
 */

class SheetMusicView extends HTMLElement {

  static attributeNames = ['format', 'url'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
    this.render();
  }

 
  setupState() {
    this.validateAttributes();
  }

  validateAttributes() {    
    const DEFAULT_FORMAT = 'pdf';
    const DEFAULT_URL = 'assets/sheetmusic/laatsheet/default.pdf';

    
    if (!this.hasAttribute('format')) {
      this.setAttribute('format', DEFAULT_FORMAT);
    }

    if (!this.hasAttribute('url')) {
      this.setAttribute('url', DEFAULT_URL);
    }
  }

  
  setupDOM(){
    this.contentWrapper = document.createElement('div');
    this.appendChild(this.contentWrapper);
    
    let template = this.querySelector('template');
    this.templateFragment = template.content;
  }
  
  render(){
    // Wipe current rendered content, by replacing all children with nothing
    this.contentWrapper.replaceChildren();

    if(this.getAttribute('format') === 'pdf') {
      let pdfDisplayFragment = this.templateFragment.querySelector('iframe')
				   .cloneNode(true);
      pdfDisplayFragment.setAttribute('src', this.getAttribute('url'));
      this.contentWrapper.appendChild(pdfDisplayFragment);
    }

    else {
      this.contentWrapper.innterText =
	'Formatet ' + this.getAttribute('format') + 'støttes ikke';
    }
  }

  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return SheetMusicView.attributeNames; }
  
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
    this.render();
  }
}


customElements.define('sheet-music-view', SheetMusicView);
