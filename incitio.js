function getVersion() {
  return "1.24c";
}

function displace(el, options) {
  return window.displacejs(el, options);
}
function gid(id) {
  return document.getElementById(id);
}
function hid(el) {
  el.style.display = 'none';
}
function vid(el) {
  el.style.display = 'initial';
}
function tvid(el) {
  if (el.style.display == 'initial')
    hid(el)
  else vid(el);
}
function viz(el) {
  if (el.style.display == 'initial')
    return true; else return false;
}
function isa(el, c) {
  if (el == undefined || el == null || el == document)
    return false;
  if (el.classList.contains(c))
    return true; else return false;
}



function isDebug() {
  return false;
}

const Utils = {
  doDebug(s) {
    if (isDebug())
      console.log(s);
  }
}

const User = {
  name: "anon",
  description: "typeical user",
  language: "en",

  get() {
    return (localStorage.getItem('in_user'));
  },
  set(user) {
    localStorage.setItem('in_user', user);
  },
  dir() {
    return this.get();
  },
  photoDir() {
    return this.dir() + "/photos"
  },
  go() {
    let user = prompt("go user");
    if (!user) {
      alert('no user');
      return;
    }
    this.set(user);
    loadDataFromDisk();
    showAlert("Welcome " + user);
    gid("idUser").innerHTML = "<h1>" + user + "</h1>";

  },
};

const Item = {

  create(type) {
    newItem = Object.create(gItemArray[0]);

    pName = prompt('Enter item name', 'unNamed');
    if (pName == null) return false;

    let stampx = new Date().getTime();
    let stamp = stampx.toString();

    newItem.id = stamp;
    newItem.type = type;

    newItem.parentId = getCurrentParentId();

    newItem.name = pName;
    newItem.description = pName + " description";
    newItem.image = "./images/noimage.jpg";

    return newItem;
  },


  getChildren(id) {

    let children = [];
    for (let i = 0; i < gItemArray.length; i++) {
      //     
      if (gItemArray[i].parentId == id) {
        children.push(gItemArray[i].id);
        thisItemObject = gItemArray[i].id; // debug
      }
    }
    return children;
  },



}


function goUser() {
}

/////////////////////////
//
// array operations
//
////////////////////////
function getItemObjectById(id) {
  for (let z = 0; z < gItemArray.length; z++) {
    //     
    if (gItemArray[z].id == id) {

      Utils.doDebug(id + ' - ' + gItemArray[z].id);

      return gItemArray[z];
    }
  }
  alert("not found " + id + " len " + id.length)
}

function getItemObjectIndexById(id) {
  for (i = 0; i < gItemArray.length; i++) {
    //     
    if (gItemArray[i].id == id) {
      return i;
    }
  }
}
////////////////////////////////


function breadCrumbs(id) {

  gChainArray = [];

  while (id != "?") {
    id = discoverChain(id);
    Utils.doDebug(id);
  }
}



function doSearch() {
  // debugger;

  divSearch.innerHTML = '';
  let lookFor = (search.value).toUpperCase();
  if (lookFor.length < 3)
    return;

  for (let i = 0; i < gItemArray.length; i++) {
    let thisName = (gItemArray[i].name).toUpperCase();

    if (thisName.includes(lookFor)) {

      createSearchButton(gItemArray[i]);
    }

  }


  // showAlert("not yet coded " + search.value);
}


function itemObjectToForm(itemObject) {
  (gid("inName")).value = itemObject.name;
  (gid("inItemId")).value = itemObject.id;
  inParentId.value = itemObject.parentId;
  (gid("inDescription")).value = itemObject.description;
  if (itemObject.image == "?")
    thePhoto.src = noImage;
  else
    thePhoto.src = forceImageLoad(itemObject.image);
}


function focusGrid(id) {
  let bs = divPhotos.getElementsByClassName("hasFocus");

  for (i = 0; i < bs.length; i++) {
    bs[i].classList.remove("hasFocus");
  }

  gridId = "image_" + id;
  thisGrid = gid(gridId)
  if (thisGrid)
    thisGrid.classList.add("hasFocus");

}

function clearAllFocii() {
  let bs = document.getElementsByClassName("hasFocus");
  for (let i = 0; i < bs.length; i++) {
    bs[i].classList.remove("hasFocus");
  }

  hid(openContainer);
}


function openItem() {
  let selected = getFormValue("inItemId");
  hid(openContainer);
  paintBreadCrumbs(selected);
}


function buttonSelected(buttonId) {

  function showOpenButton() {

    let thisItemObject = getItemObjectById(thisId);
    vid(openContainer);
    openContainer.innerHTML = "<h2>open " + thisItemObject.name + "</h2>";


  }

  let thisId = Button.idToItem(buttonId);
  // debugger;
  clearAllFocii();

  // get parent and test if this button is chain

  let thisItemObject = getItemObjectById(thisId);
  // if (thisItemObject.type == 'c')
  // ;setCurrentRoot(thisId)

  let isItem = buttonId.includes("item_");

  if (thisItemObject.type == 'c' && isItem || countDescendants(thisId)) {
    if (countDescendants(thisId))
      paintBreadCrumbs(thisId);
    else showOpenButton();
  }




  Utils.doDebug("Selectied button - " + buttonId);

  //let thisButton = gid("item_" + thisId);
  // if(!thisButton)
  //   thisButton = gid("chain_" + thisId);

  let thisButton = Button.selectById(thisId);
  thisButton.classList.add("hasFocus");

  let a = buttonId.split("_");
  let id = a[1];

  focusGrid(id);


  // this is form stuff now ( maybe move it?? )


  let itemObject = getItemObjectById(id);
  itemObjectToForm(itemObject);


  function fillParentList() {
    let np = gid("newParent");
    let theHTML = "";
    //debugger;
    for (let i = 0; i < gItemArray.length; i++) {
      //     
      if (gItemArray[i].type == "c") {

        gChainArray = [];
        let thisRoot = gItemArray[i].id;
        if (i > 0)
          while (thisRoot != "?")
            thisRoot = discoverChain(thisRoot);

        let theTitle = "";
        //debugger;
        for (let j = 0; j < gChainArray.length; j++) {
          thisItem = getItemObjectById(gChainArray[j]);
          theTitle += thisItem.name + ">";

        }
        if (gItemArray[i].id == itemObject.parentId)

          theHTML += `<option value = "${gItemArray[i].id}" selected> ${gItemArray[i].name} </option>`;
        else
          theHTML += `<option value = "${gItemArray[i].id}"  title="${theTitle}"> ${gItemArray[i].name} </option>`
      }
    }
    np.innerHTML = theHTML;

  }

  fillParentList();
}


function getFormValue(id) {
  let r = document.getElementById(id);
  return r.value
}

function deleteItem() {
  //debugger;
  let idValue = getFormValue('inItemId');
  let thisIndex = getItemObjectIndexById(idValue);
  let thisObject = getItemObjectById(idValue);
  let thisParent = thisObject.parentId;

  if (countDescendants(idValue) > 0 && thisObject.type == 'c') {
    alert("think of the children!");
    return;
  }

  gItemArray.splice(thisIndex, 1);

  paintBreadCrumbs(thisParent); // to remove button from view

  // buttonSelected(thisParent);
  Button.click("chain_" + thisParent);

  showAllItems();
}

function updateItemFromForm() {
  // debugger;
  function testChangeParent(thisItem, thisParentId) {
    gChainArray = [];
    let thisRoot = thisParentId;
    while (thisRoot != "?") {
      thisRoot = discoverChain(thisRoot);
      if (thisRoot == thisItem.id) {
        return false;
      }
    }
    return true;
  }

  let id = getFormValue('inItemId');
  let thisItem = getItemObjectById(id);

  thisItem.name = getFormValue('inName');
  thisItem.description = getFormValue('inDescription');

  let np = getFormValue('newParent');

  if (np != thisItem.parentId && !(id == 0)) {

    if (thisItem.id == 0) {
      showAlert("can't change parent of home ( it has none )");
      return;
    }
    else
      if (!testChangeParent(thisItem, np))
        showAlert("operation failed " + getItemObjectById(p).name
          + " is contained by " + thisItem.name);
      else {
        thisItem.parentId = np;

        //setCurrentRoot(thisItem.parentId);
        showAlert("parent changed");
      }
  }
  //if (thisItem.type == 'c')
  //  setCurrentRoot(thisItem.id);
  //else
  if (id != 0)
    paintBreadCrumbs(thisItem.parentId);

  clickButton(thisItem.id);

}



// create a new item from user input
/*function createItem(type) {

  newItem = Object.create(gItemArray[0]);

  pName = prompt('Enter item name', 'unNamed');
  if (pName == null) return false;

  let stampx = new Date().getTime();
  let stamp = stampx.toString();

  newItem.id = stamp;
  newItem.type = type;

  newItem.parentId = getCurrentParentId();

  newItem.name = pName;
  newItem.description = pName + " description";
  newItem.image = "./images/noimage.jpg";

  return newItem;
}*/


function doHoverButton(hoverButton) {


  // Utils.doDebug(hoverButton);

  // figure the id
  let a = hoverButton.split("_");
  id = a[1];

  thisItem = getItemObjectById(id);
  // Utils.doDebug(thisItem.image);

  //     alert(response);
  var delayInMilliseconds = 500; //1 second

  setTimeout(function () {
    //  thePhoto.src = forceImageLoad(thePhoto.src);
    theHoverPhoto.src = thisItem.image;
  }, delayInMilliseconds); // to force a refresh .. hopefully





}


function searchButtonClick(itemId) {
  let gridButton = gid("image_" + itemId);
  gridButton.click();
}


function createSearchButton(itemObject) {

  let newButton = document.createElement('button');
  let el = document.getElementById("divSearch");
  el.appendChild(newButton);

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
}

var timeout;

function hoverStart(e) {

  timeout = setTimeout(function () {
    showAlert("hello");
  }, 3000);
}


function hoverEnd(e) {
  if (timeout) {
    clearTimeout(timeout);
  }
}

function clickButton(id) {

  let buttonId = "chain_" + id;
  let b = gid(buttonId);

  if (!b)
    buttonId = "item_" + id;
  b = gid(buttonId);

  b.click();
}


function createTreeButton(itemObject, level) {
  let newButton = document.createElement('button');
  let el = document.getElementById("divTree");
  el = el.children[level];
  el.appendChild(newButton);

  el.addEventListener("touchstart", touchStart);
  el.addEventListener("touchend", touchEnd);

  if (itemObject.type == "c") {
    buttonColor = `btn btn-primary`;
  } else {
    buttonColor = `btn btn-success`;
  }

  buttonId = "tree_" + itemObject.id;

  theHTML = `<button id="${buttonId}"    class="${buttonColor}" style="margin:3px">${itemObject.name}</button>`;

  newButton.outerHTML = theHTML;
  return buttonId;

}

// Maybe move this into setCurrentRoot
function discoverChain(thisId) {

  for (let i = 0; i < gItemArray.length; i++) {

    if (gItemArray[i].id == thisId) {
      let parentId = gItemArray[i].parentId;
      gChainArray.push(thisId);
      return parentId;
    }
  }
}

function compare(aItem, bItem) {

  aName = aItem.name.toUpperCase();
  bName = bItem.name.toUpperCase();

  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  return 0;
}
function compareAlpha(aItem, bItem) {

  let aName = getItemObjectById(aItem).name;
  let bName = getItemObjectById(bItem).name;

  aName = aName.toUpperCase();
  bName = bName.toUpperCase();

  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  return 0;
}
function paintBreadCrumbs(id) {

  function clearBreadCrumbs() {
    divChain.innerHTML = "";
    divItems.innerHTML = "";
  }

  function paintChildren(id) {
    function paintChild(id) {
      thisItemObject = getItemObjectById(id);
      createItemButton(thisItemObject);
    }

    let children = Item.getChildren(id);
    children.sort(compareAlpha);
    children.forEach((item) => {
      paintChild(item);
    });

  }

  function paintParents() {
    function paintParent(item) {
      thisItemObject = getItemObjectById(item);
      createChainButton(thisItemObject);
    }

    let test = chainArray;
    chainArray.forEach((item) => {
      paintParent(item);
    });
  }
  let chainArray = getItemPath(id);
  setCurrentParentId(id);
  chainArray.reverse();

  clearBreadCrumbs();

  paintChildren(id);
  paintParents();


}




//
//  Creates all the buttons also
//
function setCurrentRoot(rootId) {
  //debugger;
  paintBreadCrumbs(rootId);
  //debugger;

  return;

  let thisItemObject = getItemObjectById(rootId);

  if (thisItemObject.type != 'c') {
    alert("set current root not container - " + rootId);
    setCurrentRoot(thisItemObject.parentId);
    return;
  }

  setCurrentParentId(rootId);

  // Create the chain buttons
  gChainArray = [];

  let thisRoot = rootId;
  while (thisRoot != "?" && gChainArray.length < 500) // remove this fix!
    thisRoot = discoverChain(thisRoot);

  gChainArray = gChainArray.reverse();
  gid("divChain").innerHTML = "";

  for (let j = 0; j < gChainArray.length; j++) {
    thisId = gChainArray[j];
    thisItemObject = getItemObjectById(thisId);
    // need thisButton?
    thisButton = createChainButton(thisItemObject);
  } // end while

  //
  // Now the children of the current root
  //
  gid("divItems").innerHTML = "";
  let kids = [];
  for (let i = 0; i < gItemArray.length; i++)
    //if (gItemArray[i].parentId == getCurrentParentId())

    if (gItemArray[i].parentId == rootId)
      kids.push(gItemArray[i]);

  if (kids.length > 0) {
    kids.sort(compare);
  }

  for (let i = 0; i < kids.length; i++)
    createItemButton(kids[i]);

}


function forceImageLoad(imageId) {
  let a = imageId.split("?x=");
  imageId = a[0];
  return imageId + "?x=" + Date.now();
}

function gridPhotoClicked(id) {
  // debugger;
  // home has no parent
  if (id == 0) {
    chain_0.click();
    //xxx.click();
    return;
  }

  let thisItem = getItemObjectById(id);

  if (thisItem.type != 'c')
    paintBreadCrumbs(thisItem.parentId);
  else
    paintBreadCrumbs(id);

  let thisButton;

  //  buttonSelected(id); // not right
  if (thisItem.type == 'c')
    thisButton = "chain_" + id;
  else
    thisButton = "item_" + id;

  let el = gid(thisButton);

  el.click();


}

function getItemPath(id) {
  //Utils.doDebug(event.currentTarget.id);
  myArray = [];
  function getParent(id) {
    let ob = getItemObjectById(id);
    //   Utils.doDebug(ob);
    return ob.parentId;
  }
  let p = id;
  while (p != "?") {
    myArray.push(p);
    //    Utils.doDebug(p);
    p = getParent(p);
  }
  return myArray;
}

function breadCrumbs(id) {

  let str = "";

  let theChain = getItemPath(id);
  for (let i = 0; i < theChain.length; i++) {
    let thisItem = getItemObjectById(theChain[i]);

    str += thisItem.name + " > ";
  }
  return str;
}


function doGridHover() {

  buttonId = event.currentTarget.id;
  let a = buttonId.split("_");
  let id = a[1];
  //Utils.doDebug(id);
  gridBreadcrumbs.innerHTML = breadCrumbs(id);

}

//
// This is the grid
//

function showAllItems() {

  let el = document.getElementById("divPhotos");
  el.innerHTML = "";

  for (i = 0; i < gItemArray.length; i++) {

    thisItemObject = gItemArray[i];

    if (thisItemObject.image == "?") {
      thisItemObject.image = noImage;

      let newButton = document.createElement('button');
      el.appendChild(newButton);
      newButtonId = "image_" + thisItemObject.id;

      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid" style="font-size:10px"
     onmouseenter="doGridHover()"
      onclick="gridPhotoClicked('${thisItemObject.id}')">`
        + thisItemObject.name + `</button>`;

    }
    else {
      let newButton = document.createElement('button');
      el.appendChild(newButton);
      newButtonId = "image_" + thisItemObject.id;

      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid" 
      onmouseenter="doGridHover()"
      onclick="gridPhotoClicked('${thisItemObject.id}')"> 
      <img src="` + forceImageLoad(thisItemObject.image) + `" style="transform:rotate(0deg)"  ></button>`;

    }
  }
}


function countDescendants(rootId) {
  function findKids(id) {
    let kids = [];
    for (let i = 0; i < gItemArray.length; i++) {
      if (gItemArray[i].parentId == id) {
        count++;
        kids.push(gItemArray[i].id);
      }
    }
    return kids;
  }


  function makeTree(thisId) {
    // Utils.doDebug("+" + count);
    let kids = findKids(thisId);
    for (let i = 0; i < kids.length; i++) {
      obj = getItemObjectById(kids[i]);
      // Utils.doDebug(obj.name);
      makeTree(kids[i]);
    }


  }
  let count = 0;

  makeTree(rootId);

  return count;

}



function doDebug(message) {
  // if (message.length == 0) gid("debugWindow").innerHTML = ""; else
  //  gid("debugWindow").innerHTML = gid("debugWindow").innerHTML + message + "</br>";

}

function showAlert(message) {
  alertBox.innerHTML = "<h3>" + message + "</h3>";
  alertBox.classList.add("animate");

}

function clearStorage() {
  localStorage.clear();

  showAlert("done clear");
  refreshJSON();
}


const noImage = "./images/noimage.jpg";
