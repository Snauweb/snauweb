export { CustomComponent }

/*
 * Element fetching and showing all information for a user
 *
 * Expects a <template> child of class .list-element that dictates the layout of
 * a given key-value pair found in the user data.
 * The key-value pair is shown in all children of class .key and .value resp.
 *
 * Attributes:
 *     id: the id of the user to show info for. Defaults to "1"
 */

class BrukerInfo extends FetchElem {

  static attributeNames = ['id'];

  constructor() {
    super();
    console.log("hello from the brukerInfo list!")
    this.setupState();
    this.setupDOM();
    this.setupListeners();
    this.configureFetch();
    this.loadData();
    //this.render();
  }

  setupState() {}

  setupDOM(){
    let listElementTemplate = this.querySelector('template.list-element');
    this.listElementFragment = listElementTemplate.content.cloneNode(true);

    this.renderNode = document.createElement('div');
    this.appendChild(renderNode);
  }

  setupListeners() {

  }
  
  configureFetch() {

  }
  
  render(){}

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
