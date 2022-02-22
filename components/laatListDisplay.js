export { LaatListDisplay }
import { DataList } from "./dataList.js"

class LaatListDisplay extends dataList {

  constructor() {
    super();
  }

  // **** BUILT-INS ****

  // Returns a list of names of attributes
  // that trigger attributeChangedCallback on change
  static get observedAttributes() { return LaatListDisplay.attributeNames; }
  
  // Lifecycle
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}

  // This method is triggered when an attribute in the list attributeNames is updated
  attributeChangedCallback(name, oldValue, newValue) {}
  
}


customElements.define('laat-list-display', LaatListDisplay);
