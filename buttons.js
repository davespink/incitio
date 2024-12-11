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
  
  createChain(itemObject) {
    let newButton = document.createElement('button');
    gid("divChain").appendChild(newButton);
  

    buttonColor = `btn btn-primary`;
    buttonId = "chain_" + itemObject.id;
    number = countDescendants(itemObject.id);

    theHTML = `<button id="${buttonId}" 
       onClick=buttonSelected("${buttonId}") onmouseenter=doHoverButton("${buttonId}")     
           class="${buttonColor} bc-button " >${itemObject.name}  <span class="badge bg-danger">${number}</span></button>`;

    newButton.outerHTML = theHTML;

    return newButton;
//ontouchstart=doHoverButton("${buttonId}") 
  },

  createItem(itemObject) {
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
    theHTML = `<button id="${buttonId}" onClick=buttonSelected("${buttonId}")  onmouseenter=doHoverButton("${buttonId}")
        onmouseleave=killHoverButton()
           class="${buttonColor} bc-button" >${itemObject.name} <span class="badge bg-dark">${badge}</span>
 
           </button>`;
//ontouchstart=doTouch("${buttonId}")
    newButton.outerHTML = theHTML;

    return buttonId;

  },



  createSearch(itemObject) {

    let newButton = document.createElement('button');
    document.getElementById("divSearchResults").appendChild(newButton);
  
    // el.addEventListener("touchstart", touchStart);
    //  el.addEventListener("touchend", touchEnd);
  
    if (itemObject.type == 'c')
      buttonColor = `btn btn-primary`;
    else
      buttonColor = `btn btn-success`;
  
    buttonId = "search_" + itemObject.id;
  
    theHTML = `<button id="${buttonId}" 
        onClick="searchButtonClick('${itemObject.id}')" 
         class="${buttonColor}" style="margin:5px">${itemObject.name}</button>`;
  
    newButton.outerHTML = theHTML;
  
    return newButton;
  },
  
}


// User clicked here
function makeNewItem(type) {
  //debugger;
  thisItemObject = Item.create(type);
  if (!thisItemObject)
    return;

  gItemArray.push(thisItemObject);

  // find last breadcrumb

  paintBreadCrumbs(thisItemObject.parentId);

  // Button.click("item_" + thisItemObject.id);
}


function handleClick() {
  alert();
  let thisButton = event.currentTarget;
  buttonSelected(thisButton.id);
}

function createChainButton(itemObject) {
  return Button.createChain(itemObject);
}


function createItemButton(itemObject) {
  return Button.createItem(itemObject);
}