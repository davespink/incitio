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





  function createChainButton(itemObject) {
    let newButton = document.createElement('button');
    let el = document.getElementById("divChain");
    el.appendChild(newButton);
  
    //  el.addEventListener("touchstart", touchStart);
    // el.addEventListener("touchend", touchEnd);
  
    buttonColor = `btn btn-primary`;
  
    buttonId = "chain_" + itemObject.id;
    number = countDescendants(itemObject.id);
  
  
    theHTML = `<button id="${buttonId}" 
        onClick=buttonSelected("${buttonId}") onmouseenter=doIt("${buttonId}")   
         class="${buttonColor}" style="margin:0px">${itemObject.name}  <span class="badge bg-danger">${number}</span></button>
         <button style="border:none"></button>`;
  
    newButton.outerHTML = theHTML;
  
    return newButton;
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
  
    theHTML = `<button id="${buttonId}" onClick=buttonSelected("${buttonId}") onmouseenter=doIt("${buttonId}")
         class="${buttonColor}" style="margin:3px">${itemObject.name} <span class="badge bg-dark">${x}</span></button>`;
  
    newButton.outerHTML = theHTML;
  
  
    return buttonId;
  
  }