const Button = {
  click(id) {
    let b = gid(id);
    b.click();
  },
  idToItem(buttonId) {
    // debugger;
    let a = buttonId.split("_");
    return a[1];
  },
  selectById(id) {
    let thisButton = gid("item_" + id);
    if (!thisButton)
      thisButton = gid("chain_" + id);
    return thisButton;
  },
}


// User clicked here
function makeNewItem(type) {
  //debugger;
  thisItemObject = Item.create(type);
  if (!thisItemObject)
    return;

  gItemArray.push(thisItemObject);

  // find last breadcrump

  paintBreadCrumbs(thisItemObject.parentId);

  // Button.click("item_" + thisItemObject.id);
}


/*
function checkDblClick(id) {
  let itemObject = getItemObjectById(id);
  if (itemObject.type == "c")
    setCurrentRoot(id);
  else
    showAlert("not a container");
}*/

function handleClick() {
  let thisButton = event.currentTarget;
  buttonSelected(thisButton.id);
}



function createChainButton(itemObject) {
  let newButton = document.createElement('button');
  let el = document.getElementById("divChain");
  el.appendChild(newButton);

  buttonColor = `btn btn-primary`;
  buttonId = "chain_" + itemObject.id;
  number = countDescendants(itemObject.id);

  theHTML = `<button id="${buttonId}" 
        onClick="handleClick()" onmouseenter=doHoverButton("${buttonId}")   
         class="${buttonColor}" style="margin:2px">${itemObject.name}  <span class="badge bg-danger">${number}</span></button>`;

  newButton.outerHTML = theHTML;

  return newButton;
}


function createItemButton(itemObject) {
  let newButton = document.createElement('button');
  let el = document.getElementById("divItems");
  el.appendChild(newButton);

  let badge;
  if (itemObject.type == "c") {
    buttonColor = `btn btn-primary`;
    badge = countDescendants(itemObject.id);
  } else {
    buttonColor = `btn btn-success`;
    badge = "";
  }

  buttonId = "item_" + itemObject.id;
  theHTML = `<button id="${buttonId}" onClick=buttonSelected("${buttonId}") onmouseenter=doHoverButton("${buttonId}")
         class="${buttonColor}" style="margin:3px">${itemObject.name} <span class="badge bg-dark">${badge}</span></button>`;

  newButton.outerHTML = theHTML;

  return buttonId;

}