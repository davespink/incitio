

// TLA helpers

function gid(name) {
  return document.getElementById(name);
}

function hid(el) {
  el.display = "none";
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

function makeNewButton(type) {
  newItemObject = createItem(type);
  if (newItemObject)
    b = createItemButton(newItemObject);

  //  setTimeout(clickButton(b), 1000);
  clickButton(b);
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
  let searchInput = gid("search");
  showAlert("not yet coded");
}


function itemObjectToForm(itemObject) {
  (gid("inName")).value = itemObject.name;
  (gid("inItemId")).value = itemObject.id;
  (gid("inParentId")).value = itemObject.parentId;
  (gid("inDescription")).value = itemObject.description;
  if (itemObject.image == "?")
    thePhoto.src = "./images/noimage.jpg";
  else
    thePhoto.src = itemObject.image;
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


function buttonSelected(buttonId) {

  let bs = document.getElementsByClassName("hasFocus");

  for (i = 0; i < bs.length; i++) {
    bs[i].classList.remove("hasFocus");
  }

  let thisButton = gid(buttonId);

  thisButton.classList.add("hasFocus");

  let id = buttonId.split("_");

  focusGrid(id[1]);

  let itemObject = getItemObjectById(id[1]);
  itemObjectToForm(itemObject);

  function fillParentList() {

    let np = gid("newParent");
    let theHTML = "";

    for (i = 0; i < gItemArray.length; i++) {
      //     
      if (gItemArray[i].type == "c") {

        if (gItemArray[i].id == itemObject.parentId)

          theHTML += `<option value="` + gItemArray[i].id + `"  selected >` + gItemArray[i].name + `</option>`;
        else
          theHTML += `<option value="` + gItemArray[i].id + `">` + gItemArray[i].name + `</option>`;
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

  let idValue = getFormValue('inItemId');

  ar = idValue.split("_");
  id = ar[1];

  thisIndex = getItemObjectIndexById(idValue);

  gItemArray.splice(thisIndex, 1);

  setCurrentRoot(getCurrentParentId());
}

function updateItemsFromForm() {

  let nameValue = getFormValue('inName');
  let descriptionValue = getFormValue('inDescription');
  let idValue = getFormValue('inItemId');

  ar = idValue.split("_");

  id = ar[1];

  for (i = 0; i < gItemArray.length; i++) {
    //     
    if (gItemArray[i].id == idValue) {
      gItemArray[i].name = nameValue;
      gItemArray[i].description = descriptionValue;
      gItemArray[i].parentId = getFormValue('newParent');
      //    gItemArray[i].image = thePhoto.src;
      break;
    }
  }


  setCurrentRoot(getCurrentParentId());
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
  newItem.parentId = getCurrentParentId();
  newItem.name = pName;
  newItem.description = pName + " description";
  newItem.image = "?";
  gItemArray.push(newItem);

  return newItem;
}


function createChainButton(itemObject) {
  let newButton = document.createElement('button');
  let el = document.getElementById("divChain");
  el.appendChild(newButton);

  buttonColor = `btn btn-primary`;

  buttonId = "chain_" + itemObject.id;

  theHTML = `<button id="${buttonId}" 
      onClick=buttonSelected("${buttonId}")  ondblclick=setCurrentRoot("${itemObject.id}") 
       class="${buttonColor}" style="margin:5px">${itemObject.name}</button><button style="position:relative;bottom:-10px;height:0px;background-color:transparent;border:none"><h1>` + `>` + `</h1></button>`;

  newButton.outerHTML = theHTML;

  return newButton;

  //    resetPictureBox();

}

function clickButton(buttonId) {

  b = gid(buttonId);
  b.click();
}

function createItemButton(itemObject) {
  let newButton = document.createElement('button');
  let el = document.getElementById("divItems");
  el.appendChild(newButton);

  if (itemObject.type == "c") {
    buttonColor = `btn btn-primary`;
  } else {
    buttonColor = `btn btn-success`;
  }

  buttonId = "item_" + itemObject.id;

  theHTML = `<button id="${buttonId}" onClick=buttonSelected("${buttonId}")  ondblclick=setCurrentRoot("${itemObject.id}")    class="${buttonColor}" style="margin:5px">${itemObject.name}</button>`;

  newButton.outerHTML = theHTML;
  return buttonId;

}


// Maybe move this into setCurrentRoot
function discoverChain(thisId) {

  for (i = 0; i < gItemArray.length; i++) {
    //     alert(gItemArray[i].id);
    if (gItemArray[i].id == thisId) {
      let parentId = gItemArray[i].parentId;
      gChainArray.push(thisId);
      return parentId;
    }
  }
}


function setCurrentRoot(rootId) {

  if (getItemObjectById(rootId).type != "c") {
    showAlert("not a container");
    return;
  }

  //   doDebug("root is " + rootId);
  setCurrentParentId(rootId);

  gChainArray = [];

  let thisRoot = rootId;

  while (thisRoot != "?")
    thisRoot = discoverChain(thisRoot);

  gChainArray = gChainArray.reverse();

  gid("divChain").innerHTML = "";

  for (j = 0; j < gChainArray.length; j++) {
    thisId = gChainArray[j];
    thisItemObject = getItemObjectById(thisId);
    thisButton = createChainButton(thisItemObject);
  }

  gid("divItems").innerHTML = "";
  for (i = 0; i < gItemArray.length; i++)

    if (gItemArray[i].parentId == getCurrentParentId())
      createItemButton(gItemArray[i]);

}


/*
function resetItemDiv() {
  gid("divItems").innerHTML = "";


}
  */


function downloadData() {


  let js = localStorage.getItem(json.value);
  //  let str = JSON.stringify(js);
  let str = js;

  //   alert(str);

  ///  str="xxx" + str;

  //  str="abigstringwhatsup";
  var data = new Blob([str]);
  var a = document.getElementById('a');
  a.href = URL.createObjectURL(data);

  a.click();

  showAlert("Downloaded " + json.value)
}



function gridPhotoClicked(id) {

  let thisItemObject = getItemObjectById(id);
  //    itemObjectToForm(thisItemObject);

  setCurrentRoot(thisItemObject.parentId);



  let bs = document.getElementsByClassName("hasFocus");

  for (i = 0; i < bs.length; i++) {

    bs[i].classList.remove("hasFocus");
  }

  // gridId = "image_" + id;
  // (gid(gridId)).classList.add("hasFocus");
  let buttonId = "item_" + id;
  buttonSelected(buttonId);

}

function showAllItems() {


  //  hid(divItems);

  let el = document.getElementById("divPhotos");
  el.innerHTML = "";

  for (i = 0; i < gItemArray.length; i++) {

    thisItemObject = gItemArray[i];

    if (thisItemObject.image == "?") {


      let newButton = document.createElement('button');

      el.appendChild(newButton);

      newButtonId = "image_" + thisItemObject.id;

      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid" style="font-size:10px;" onclick="gridPhotoClicked('${thisItemObject.id}')">`
        + thisItemObject.name + `</button>`;

    }
    // <button id="image_1725836282864" class="item-grid hasFocus" onclick="gridPhotoClicked('1725836282864')">./photos/img_1727041984.jpg</button>
    else {
      let newButton = document.createElement('button');

      el.appendChild(newButton);

      newButtonId = "image_" + thisItemObject.id;

      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid"  onclick="gridPhotoClicked('${thisItemObject.id}')"> <img src="` + thisItemObject.image + `""></button>`;

    }
  }

}


function doDebug(message) {
  if (message.length == 0) gid("debugWindow").innerHTML = ""; else
    gid("debugWindow").innerHTML = gid("debugWindow").innerHTML + message + "</br>";

}

function showAlert(message) {
  alertBox.innerHTML = "<h1>" + message + "</h1>";
  alertBox.classList.add("animate");

}

function refreshJSON() {

  let theHTML = "";
  for (i = 0; i < localStorage.length; i++) {
    theHTML += (`<option>` + localStorage.key(i) + `</option>`);
  }
  gid("json").innerHTML = theHTML;

}


function toJSON() {
  const myJSON = JSON.stringify(gItemArray);
  // Store
  localStorage.setItem("jsonString", myJSON);
  showAlert("defunct");
}


function getJSON() {
  let js = localStorage.getItem(json.value);

  //alert(js);

  gItemArray = JSON.parse(js);

  setCurrentRoot(0);

  showAlert("done get");
}


function putJSON() {
  const myJSON = JSON.stringify(gItemArray);
  // alert(myJSON);
  // Store
  localStorage.setItem(json.value, myJSON);

  let msg = "saved data to " + json.value;

  showAlert(msg);
}


function newJSON() {

  let key = prompt("input key");

  if (key) {
    const myJSON = JSON.stringify(gItemArray);
    // Store
    localStorage.setItem(key, myJSON);

    refreshJSON();

  }

}

function deleteJSON() {
  localStorage.removeItem(json.value);
  showAlert("done delete");

  refreshJSON();
}


function clearStorage() {
  //localStorage.clear();

  //  showAlert("done clear");
  //  refreshJSON();
}



// FILE UPLOAD STUFF

function uploadImageFile() {

  var files = file.files;

  if (files.length > 0) {

    var formData = new FormData();
    let theDir = "photos";

    formData.append("file", files[0]); // this passes the filename to PHP

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./uploadincitio.php?&dir=" + theDir, true);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        var response = this.responseText;


        if (response == 1) {

          alert("File not uploaded. ");

        } else {

          thePhoto.src = response; // here's the display

          let idValue = getFormValue('inItemId');
          let theItemObject = getItemObjectById(idValue);

          theItemObject.image = response;

          showAlert("file uploaded");
          showAllItems();

        }
      }
    };

    // Send request with data
    xhttp.send(formData);

  } else {
    showAlert("Please select a file");
  }
}

async function readText(event) {
  const file = event.target.files.item(0);
  const text = await file.text();


  localStorage.setItem(json.value, text);

  showAlert("File uploaded to " + json.value);
}



