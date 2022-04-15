let userInfoListCopy;
let userInfoEditCopy;
let renderNode;
let toggleButtonHandle;

let showEdit = false;

function init(){
  setupDOM();
  setupListeners();
  render();
}

function setupDOM(){
  let userInfoListHandle = document.querySelector('.user-info-display');
  let userInfoEditHandle = document.querySelector('.user-info-edit');
  userInfoListCopy = userInfoListHandle.cloneNode(true);
  userInfoEditCopy = userInfoEditHandle.cloneNode(true);

  toggleButton = document.querySelector('toggle-button.edit-button');
  
  renderNode = document.querySelector('.render-node')
  
  console.log(toggleButton)

}

function setupListeners() {
  toggleButton.addEventListener('stateChange', (e)=>{
    if(showEdit) {
      showEdit = false;
    }
    else {
      showEdit = true;
    }
    render();
  })
}

function render() {
  renderNode.replaceChildren()
  if(showEdit) {
    let editViewCopy = userInfoEditCopy.cloneNode(true);
    renderNode.appendChild(editViewCopy);
  }
  else {
    let listViewCopy = userInfoListCopy.cloneNode(true);
    renderNode.appendChild(listViewCopy);
  }
}


window.addEventListener('load', init);
