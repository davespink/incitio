function getVersion() {
  return ("Incitio v1.25g");
}
/*
function displace(el, options) {
  return window.displacejs(el, options);
}*/
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


const Alert = {
  show(message) {
    alertText.innerHTML = "<h3>" + message + "</h3>";
    alertBox.classList.add("animate");
  },

}

const User = {
  name: "anon",
  description: "typical user",
  language: "en",
  get() {
    let l = location.href;
    let a = l.split("?");
    if (a.length > 1) {
      a = a[1].split("=");
      let u = a[1];
      return u;
    }
    else
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
    gid("idUser").innerHTML = "<H1>" + user + "</H1>";

  },
};
//
//    Item - the data stored on each item or container
//
const Item = {
  // belongs in UI
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
  hasChildren(id) {
    return this.getChildren(id).length;
  },
  countChildren(id) {
    return this.getChildren(id).length;
  },
  getById(id) {
    /*
    for (let z = 0; z < gItemArray.length; z++) {
      //     
      if (gItemArray[z].id == id) {

        Utils.doDebug(id + ' - ' + gItemArray[z].id);

        return gItemArray[z];
      }
    }
    alert("not found " + id + " len " + id.length) */


    return gItemArray[this.getIndexById(id)];

  },
  getIndexById(id) {
    for (i = 0; i < gItemArray.length; i++) {
      //     
      if (gItemArray[i].id == id) {
        return i;
      }
    }
  },
  getDescendants(rootId) {
    let fullMonte = [];
    function findKids(id) {
      let kids = [];
      for (let i = 0; i < gItemArray.length; i++) {
        if (gItemArray[i].parentId == id) {
          //  count++;
          kids.push(gItemArray[i].id);
          fullMonte.push(gItemArray[i].id);
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
    makeTree(rootId);
    return fullMonte;
  },



  countDescendants(id) {
    return this.getDescendants(id).length;
    // return fm.length;

  },

}

const UI = {
  showAllItems() {
    let x = getCurrentParentId();

    let el = document.getElementById("divPhotos");
    el.innerHTML = "";

    function showItem(thisItemObject) {
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
        <img src="` + forceImageLoad(thisItemObject.image) + `"></button>`;

      }
    }

    let showArray = gItemArray;
    showArray = Item.getDescendants(getCurrentParentId());

    showArray.forEach(id => {

      showItem(Item.getById(id));
    }
    )


  },


  paintBreadCrumbs(id) {

    function clearBreadCrumbs() {
      divChain.innerHTML = "";
      divItems.innerHTML = "";
    }

    function paintChildren(id) {
      function paintChild(id) {
        //let thisItemObject = getItemObjectById(id);

        //   Button.createItem(itemObject)
        Button.createItem(getItemObjectById(id));
      }

      let children = Item.getChildren(id);
      children.sort(compareAlpha);
      children.forEach((item) => {
        paintChild(item);
      });

    }

    function paintParents() {
      function paintParent(itemId) {
        Button.createChain(getItemObjectById(itemId));
      }

      // let test = chainArray;
      chainArray.forEach((itemId) => {
        paintParent(itemId);
      });

      if (Item.countDescendants(id) > Item.countChildren(id))
        vid(gid("explodeContainer"));

    }



    let chainArray = getItemPath(id);
    setCurrentParentId(id);
    chainArray.reverse();

    clearBreadCrumbs();

    paintChildren(id);
    paintParents();

    if (countDescendants(id) == Item.countChildren(id)) {
      hid(gid("explodeContainer"));
    }

    let thisItemObject = getItemObjectById(id);
    explodeContainer.innerHTML = "show total content of " + thisItemObject.name;

  },



}

/////////////////////////
//
// array operations
//
////////////////////////
function getItemObjectById(id) {
  return Item.getById(id);
}

function getItemObjectIndexById(id) {
  return Item.getIndexById(id);
}
////////////////////////////////

/*
function breadCrumbs(id) {
  alert("xx");

  return;

  gChainArray = [];
  while (id != "?") {
    id = discoverChain(id);
    Utils.doDebug(id);
  }
}

*/

function doSearch() {
  // debugger;

  divSearchResults.innerHTML = '';
  let lookFor = (search.value).toUpperCase();
  if (lookFor.length < 3)
    return;

  for (let i = 0; i < gItemArray.length; i++) {
    let thisName = (gItemArray[i].name).toUpperCase();

    if (thisName.includes(lookFor)) {

      createSearchButton(gItemArray[i]);
    }

  }
}



function doExplode(id) {


  paintExplosion(id);

  hid(gid("explodeContainer"));


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
  UI.paintBreadCrumbs(selected);
}

function buttonSelected(buttonId) {

  function showOpenButton() {
    let thisItemObject = Item.getById(thisId);//(thisId);
    vid(openContainer);
    openContainer.innerHTML = "open " + thisItemObject.name;
  }
  // debugger;
  clearAllFocii();

  // get parent and test if this button is chain
  let thisId = Button.idToItem(buttonId);

  let thisItemObject = getItemObjectById(thisId);

  let isItem = buttonId.includes("item_");

  if (thisItemObject.type == 'c' && isItem || Item.countDescendants(thisId)) {
    if (Item.countDescendants(thisId))
      UI.paintBreadCrumbs(thisId);
    else
      showOpenButton();
  } else {
    UI.paintBreadCrumbs(thisItemObject.parentId);
  }

  Utils.doDebug("Selected button - " + buttonId);

  let thisButton = Button.selectById(thisId);
  thisButton.classList.add("hasFocus");

  let a = buttonId.split("_");
  let id = a[1];

  focusGrid(id);

  theHoverPhoto.src = forceImageLoad(thisItemObject.image);


  theName.innerHTML = breadCrumbs(thisId);
  //divDescription.innerHTML =  thisItemObject.description;
  // this is form stuff now ( maybe move it?? )

  let itemObject = getItemObjectById(id);
  itemObjectToForm(itemObject);

  function makeParentList() {

    let parents = [];

    gItemArray.forEach((item) => {
      if (item.type == 'c')
        parents.push(item);
    });

    parents.sort(compareItems); // change name to compareItems

    theHTML = "";

    parents.forEach((item) => {
      title = breadCrumbs(item.id);
      if (item.id == itemObject.parentId)
        theHTML += `<option value = "${item.id}" selected> ${item.name} </option>`;
      else
        theHTML += `<option value = "${item.id}"  title="${title}" > ${item.name} </option>`;
    });



    let np = gid("newParent");
    np.innerHTML = theHTML;

  }

  makeParentList();

  showAllItems();
}


function getFormValue(id) {
  let r = document.getElementById(id);
  return r.value
}

function deleteItem() {

  let idValue = getFormValue('inItemId');
  let thisIndex = getItemObjectIndexById(idValue);
  let thisObject = getItemObjectById(idValue);
  let thisParent = thisObject.parentId;

  if (countDescendants(idValue) > 0 && thisObject.type == 'c') {
    reply = confirm("do you want to delete " + thisObject.name + "? , this will delete " + Item.countDescendants(idValue) + " other items");
    if (!reply)
      return;

    //   let progeny = Item.getDescendants(idValue);

    Item.getDescendants(idValue).forEach(id => {
      gItemArray.splice(Item.getIndexById(id), 1);
    });

    alert("done");
  }

  gItemArray.splice(thisIndex, 1);

  UI.paintBreadCrumbs(thisParent); // to remove button from view

  // buttonSelected(thisParent);
  Button.click("chain_" + thisParent);

  showAllItems();
}

function updateItemFromForm() {

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

  if (id != 0)
    UI.paintBreadCrumbs(thisItem.parentId);

  clickButton(thisItem.id);

}



var flag;
function doHoverButton(hoverButton) {
  if (mobile()) return;
  id = Button.idToItem(hoverButton);
  theName.innerHTML = breadCrumbs(id);

  thisItem = getItemObjectById(id);
  // Utils.doDebug(thisItem.image);

  //     alert(response);
  var delayInMilliseconds = 2000;
  flag = true;

  setTimeout(function () {
    if (flag) {
      theHoverPhoto.src = forceImageLoad(thisItem.image);
      // console.log(flag);
    }
  }, delayInMilliseconds); // to force a refresh .. hopefully
}

function killHoverButton() {
  flag = false;
}

function doTouch(touchButton) {
  console.log(touchButton);
  id = Button.idToItem(touchButton);
  theName.innerHTML = breadCrumbs(id);
}

function searchButtonClick(itemId) {
  let gridButton = gid("image_" + itemId);
  gridButton.click();
}


function createSearchButton(itemObject) {

  return Button.createSearch(itemObject);

  /*
    let newButton = document.createElement('button');
    let el = document.getElementById("divSearchResults");
    el.appendChild(newButton);
  
   
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
    */
}






var timeout;

// unused
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

function compareItems(aItem, bItem) {

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



function paintExplosion(id) {

  function clearItems() {
    divItems.innerHTML = "";
  }

  function paintDescendants(id) {
    function paintChild(id) {
      thisItemObject = getItemObjectById(id);
      createItemButton(thisItemObject);
    }
    let children = getDescendants(id);
    children.sort(compareAlpha);
    children.forEach((item) => {
      paintChild(item);
    });

  }

  clearItems();

  paintDescendants(id);

}


function paintBreadCrumbs(id) { return UI.paintBreadCrumbs(id); }

//
//  Creates all the buttons also
//
function setCurrentRoot(rootId) {
  alert("what??");
  UI.paintBreadCrumbs(rootId);
  debugger;
  return;
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
    UI.paintBreadCrumbs(thisItem.parentId);
  else
    UI.paintBreadCrumbs(id);

  let thisButton;

  //  buttonSelected(id); // not right
  if (thisItem.type == 'c')
    thisButton = "chain_" + id;
  else
    thisButton = "item_" + id;

  Button.click(thisButton);



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
  theChain = theChain.reverse();

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
  Utils.doDebug(id);

  gridBreadcrumbs.innerHTML = breadCrumbs(id);

}

//
// This is the grid
//

function showAllItems() {

  UI.showAllItems();

  return;

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



function getDescendants(rootId) {

  return Item.getDescendants(rootId);
  // moved to Item
  let fullMonte = [];
  function findKids(id) {
    let kids = [];
    for (let i = 0; i < gItemArray.length; i++) {
      if (gItemArray[i].parentId == id) {
        //  count++;
        kids.push(gItemArray[i].id);
        fullMonte.push(gItemArray[i].id);
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

  makeTree(rootId);
  return fullMonte;
}

function countDescendants(rootId) {

  return Item.countDescendants(rootId);

  let fm = getDescendants(rootId);
  return fm.length;

}








function doDebug(message) {
  // if (message.length == 0) gid("debugWindow").innerHTML = ""; else
  //  gid("debugWindow").innerHTML = gid("debugWindow").innerHTML + message + "</br>";

}

function showAlert(message, type) {
  Alert.show(message);
}

function clearStorage() {
  localStorage.clear();

  showAlert("done clear");
  refreshJSON();
}


const noImage = "./images/noimage.jpg";
