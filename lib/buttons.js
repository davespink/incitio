function makeNewButton(type) {
 
    newItemObject = createItem(type);
    newItemObject.image = noImage;
    if (newItemObject) {
//showAllItems();
      b = createItemButton(newItemObject);
   //   clickButton(b);
    }
  }



  function checkDblClick(id){
    let itemObject = getItemObjectById(id);
    if(itemObject.type=="c")
      setCurrentRoot(id);
    else
    showAlert("not a container");
  }

  function createItemButton(itemObject) {


 
  
  let newButton = document.createElement('button');
    let el = document.getElementById("divItems");
    el.appendChild(newButton);
  
    //  el.addEventListener("touchstart", touchStart);
    // el.addEventListener("touchend", touchEnd);
    let x;
    if (itemObject.type == "c") {
      buttonColor = `btn btn-primary`;
      x = countDescendants(itemObject.id);
    } else {
      buttonColor = `btn btn-success`;
      x = "";
    }
  
    
    buttonId = "item_" + itemObject.id;
  
  
    theHTML = `<button id="${buttonId}" onClick=buttonSelected("${buttonId}")
        ondblclick=checkDblClick("${itemObject.id}")
        class="${buttonColor}" style="margin:3px">${itemObject.name} <span class="badge bg-dark">${x}</span></button>`;
  
    newButton.outerHTML = theHTML;
  
  
    return buttonId;
  
  }