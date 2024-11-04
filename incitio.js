

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




function getVersion() {
  return "1.24";
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


function goUser() {
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


  let x = buttonId.split("_");
  let thisId = x[1];


  /*
  for (let i = 0; i < gItemArray.length; i++) {
    obj = gItemArray[i];
    if (obj.parentId == thisId) {
      setCurrentRoot(thisId);
      // its now a chain button
      buttonId = "chain_" + thisId;
      break;
    }
  }
*/

  clearAllFocii();

  let thisItemObject = getItemObjectById(thisId);
  // if (thisItemObject.type == 'c')
  // ;setCurrentRoot(thisId)
  if (countDescendants(thisId) && thisItemObject.type == 'c')
    setCurrentRoot(thisId);

  buttonId = "chain_" + thisId;
  if (!gid(buttonId))
    buttonId = "item_" + thisId;

  console.log("Selectied button - " + buttonId);

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


function getFormValue(id) {
  let r = document.getElementById(id);
  return r.value
}

function deleteItem() {
  //debugger;
  let idValue = getFormValue('inItemId');



  if (countDescendants(idValue) > 0) {
    alert("think of the children!");
    return;
  }


  let thisIndex = getItemObjectIndexById(idValue);
  let thisObject = getItemObjectById(idValue);
  let thisParent = thisObject.parentId;

  gItemArray.splice(thisIndex, 1);

  setCurrentRoot(thisParent); // to remove button from view




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
    setCurrentRoot(thisItem.parentId);

  clickButton(thisItem.id);

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
      onClick=buttonSelected("${buttonId}")   
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

  // if(!thisId)
  // alert("no id");
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

  if (thisItemObject.type != 'c')
    alert("error - " + rootId)

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
  // home has no parent
  if (id == 0) {
    chain_0.click();
    //xxx.click();
    return;
  }

  let thisItem = getItemObjectById(id);

  if (thisItem.type != 'c')
    setCurrentRoot(thisItem.parentId);
  else
    setCurrentRoot(id);

  let thisButton;

  //  buttonSelected(id); // not right
  if (thisItem.type == 'c')
    thisButton = "chain_" + id;
  else
    thisButton = "item_" + id;

  let el = gid(thisButton);

  el.click();


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
      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid" style="font-size:10px"
     onmouseenter="tester.innerHTML =  '${thisItemObject.name}' "
      onclick="gridPhotoClicked('${thisItemObject.id}')">`
        + thisItemObject.name + `</button>`;

    }
    else {
      let newButton = document.createElement('button');
      el.appendChild(newButton);
      newButtonId = "image_" + thisItemObject.id;

      // maybe rotate?
      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid" 
      onmouseenter="tester.innerHTML =  '${thisItemObject.name}' "
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
