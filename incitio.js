

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

/*
function makeNewButton(type) {
  newItemObject = createItem(type);
  newItemObject.image = noImage;
  if (newItemObject) {
    showAllItems();
    b = createItemButton(newItemObject);
    clickButton(b);
  }
}
*/



function getVersion() {

  return "1.23";
}

function getUser() {
  return gUser;
}

function setUser(user) {
  gUser = user;
}

function userDir() {
  return getUser();
}

function photoDir() {
  return userDir() + "/photos";
}

function goUser(user) {

  setUser(user);
  showAlert("Welcome " + user);
  gid("idUser").innerHTML = "<h1>" + user + "</h1>";
}

/////////////////////////
//
// array operations
//
////////////////////////
function getItemObjectById(id) {
  for (i = 0; i < gItemArray.length; i++) {
    //     
    if (gItemArray[i].id == id) {
      return gItemArray[i];
    }
  }
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



function doSearch() {
  // debugger;

  divSearch.innerHTML = '';
  let lookFor = (search.value).toUpperCase();
  if (lookFor.length < 3)
    return;

  for (let i = 0; i < gItemArray.length; i++) {
    let thisName = (gItemArray[i].name).toUpperCase();

    if (thisName.includes(lookFor)) {


      //alert(gItemArray[i].name);

      //let gridButton = gid("image_" + gItemArray[i].id);

      // gridButton.click();

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

function changeParent() {
  gid("inParentId").value = gid("newParent").value;
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
}

function buttonSelected(buttonId) {

  clearAllFocii();

  let thisButton = gid(buttonId);
  thisButton.classList.add("hasFocus");

  let a = buttonId.split("_");
  let id = a[1];

  focusGrid(id);

  let itemObject = getItemObjectById(id);
  itemObjectToForm(itemObject);

  // let c = countDescendants(id);
  //alert(c);
  // console.log(itemObject.name + " has " + c + " descendants");


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
// ??????
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

  gItemArray.splice(thisIndex, 1);

  setCurrentRoot(thisParent); // to remove button from view




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
  let nameValue = getFormValue('inName');
  let descriptionValue = getFormValue('inDescription');
  let idValue = getFormValue('inItemId');

  ar = idValue.split("_");

  id = ar[1];
  let thisItem;

  for (let i = 0; i < gItemArray.length; i++) {
    thisItem = gItemArray[i];
    if (thisItem.id == idValue) {
      thisItem.name = nameValue;
      thisItem.description = descriptionValue;
      let p = getFormValue('newParent');
      if (p != thisItem.parentId) {

        if (p != "?" && testChangeParent(thisItem, p)) {
          showAlert("parent changed");
          thisItem.parentId = getFormValue('newParent');
          setCurrentRoot(thisItem.parentId);
        }
        else {
          showAlert("operation failed " + getItemObjectById(p).name
            + " is contained by " + thisItem.name);

        }
      }
      //    gItemArray[i].image = thePhoto.src;
      break;
    }
  }
}

// create a new item from user input
function createItem(type) {

  newItem = Object.create(gItemArray[0]);

  pName = prompt('Enter item name', 'unNamed');
  if (pName == null) return false;

  let stampx = new Date().getTime();
  let stamp = stampx.toString();

  newItem.id = stamp;
  newItem.type = type;
  // newItem.parentId = getCurrentParentId();

  newItem.parentId = gid("inItemId").value;

  newItem.name = pName;
  newItem.description = pName + " description";
  newItem.image = "?";
  gItemArray.push(newItem);

  showAllItems();

  return newItem;
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
      onClick=buttonSelected("${buttonId}")  ondblclick=setCurrentRoot("${itemObject.id}") 
       class="${buttonColor}" style="margin:0px">${itemObject.name}  <span class="badge bg-danger">${number}</span></button>
       <button style="border:none"></button>`;

  newButton.outerHTML = theHTML;

  return newButton;
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

function clickButton(buttonId) {
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
//
//  Creates all the buttons also
//
function setCurrentRoot(rootId) {

  let thisItemObject = getItemObjectById(rootId);

  //if (thisItemObject.type != "c") {
  //  showAlert("not a container");
  //return;
  //}

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
    if (gItemArray[i].parentId == getCurrentParentId())
      kids.push(gItemArray[i]);

  if (kids.length > 0) {
    kids.sort(compare);
  }

  for (let i = 0; i < kids.length; i++)
    createItemButton(kids[i]);

  // showAllItems();
}


function forceImageLoad(imageId) {
  let a = imageId.split("?x=");
  imageId = a[0];
  return imageId + "?x=" + Date.now();
}

function gridPhotoClicked(id) {
  // debugger;
  if (id == 0) {
    chain_0.click();
    //xxx.click();
    return;
  }

  let thisItemObject = getItemObjectById(id);
  setCurrentRoot(thisItemObject.parentId);
  let bs = document.getElementsByClassName("hasFocus");
  for (i = 0; i < bs.length; i++) {
    bs[i].classList.remove("hasFocus");
  }
  // select in itemDiv
  let buttonId = "item_" + id;
  buttonSelected(buttonId);

  let el = gid("image_" + id);;

  if (el.children[0].src)
    thePhoto.src = forceImageLoad(el.children[0].src);

  // xxx.click();
}

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
      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid" style="font-size:10px" onclick="gridPhotoClicked('${thisItemObject.id}')">`
        + thisItemObject.name + `</button>`;

    }
    else {
      let newButton = document.createElement('button');
      el.appendChild(newButton);
      newButtonId = "image_" + thisItemObject.id;

      // maybe rotate?
      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid"  onclick="gridPhotoClicked('${thisItemObject.id}')"> 
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
    // console.log("+" + count);
    let kids = findKids(thisId);
    for (let i = 0; i < kids.length; i++) {
      obj = getItemObjectById(kids[i]);
      // console.log(obj.name);
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
var gUser = "";
