export { LaatView }

/*
 * Main component of the laat info page
 * Displays names, descriptions, recordings and sheet music for a laat in
 * the database. Offloads work to child components rather than generating the full
 * page itself. This is to try to make the functionality of this component
 * modular and reusable.
 *
 * What this component does, however, is to examine the url for id when the id attribute
 * is either unspecified, or set to 'url'. This makes it possible to link to a laat page
 *
 * As with many of the other components in this project, is is mainly concerned
 * with data and interaction. The layout and structure of the document is
 * managed through HTML and CSS.
 *
 * Attributes:
 *     id: the ID of the song to display info about, 
 *         or 'url' if the url parameter 'id' should be used
 *    
 * Expects children:
 * <laat-info>, <recording-list>, <sheet-music-select>
 */

class LaatView extends HTMLElement {

  // Propagates the id to all children components
  // If id is set to 'url', look for the id in the url instead
  static attributeNames = ['id'];

  constructor() {
    super();
    this.setupState();
    this.setupDOM();
  }


  setupState() {
    this.validateIdParameter();
  }

  setupDOM(){
    this.laatInfoElem = this.querySelector('laat-info');
    this.laatInfoElem.setAttribute('id', this.getAttribute('id'));

    this.laatRecListElem = this.querySelector('recording-list');
    this.laatRecListElem.setAttribute('id', this.getAttribute('id'));
  }

  
  validateIdParameter() {
    // First, read id of laat to display from URL if requested
    let shouldReadURL = false;
    if(!this.hasAttribute('id')) {
      shouldReadURL = true;
    }
    if(this.hasAttribute('id') && this.getAttribute('id') === 'url') {
      shouldReadURL = true;
    }

    if(shouldReadURL) {
      let params = window.location.search;

      let idParamLocation = params.search('id');

      // If 'id' is not present in the URL, stop trying to read and print a warning
      if(idParamLocation === -1) {
	console.error(
	  "The laat-info component was asked to look for an " +
	  "id parameter in the url that does not exist"
	)
	return;
      }

      let separatorOffset = params.slice(idParamLocation).search('&');
      let equalsSignOffset = params.slice(idParamLocation).search('=');
      
      // No separator after the id parameter means it is the last parameter.
      // The end of the parameter value is thus at 1 index beyond the end
      // of the string
      if(separatorOffset === -1) {
	separatorOffset = params.length - idParamLocation;
      }

      let idParamValue = params.slice(idParamLocation + equalsSignOffset + 1,
				      idParamLocation + separatorOffset);

      this.setAttribute('id', idParamValue);
    }
  }

  
  // Inform children of a new laat
  notifyChildren(){
    
  }

  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return LaatView.attributeNames; }
  
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
      this.validateIdParameter();
      this.notifyChildren();
    }
  }
}


customElements.define('laat-view', LaatView);
