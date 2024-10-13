



// V1.16



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
  newItemObject.image = "./images/noimage.jpg";
  if (newItemObject) {
    b = createItemButton(newItemObject);
    clickButton(b);
  }


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
  (gid("inParentId")).value = itemObject.parentId;
  (gid("inDescription")).value = itemObject.description;
  if (itemObject.image == "?")
    thePhoto.src = noImage;
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

  for (let i = 0; i < bs.length; i++) {
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
    // debugger;
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

  let idValue = getFormValue('inItemId');


  thisIndex = getItemObjectIndexById(idValue);

  gItemArray.splice(thisIndex, 1);

  setCurrentRoot(getCurrentParentId());

  showAllItems();
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

  el.addEventListener("touchstart", touchStart);
  el.addEventListener("touchend", touchEnd);

  buttonColor = `btn btn-primary`;

  buttonId = "chain_" + itemObject.id;

  theHTML = `<button id="${buttonId}" 
      onClick=buttonSelected("${buttonId}")  ondblclick=setCurrentRoot("${itemObject.id}") 
       class="${buttonColor}" style="margin:0px">${itemObject.name}</button>
       <button style="border:none">></button>`;

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

  el.addEventListener("touchstart", touchStart);
  el.addEventListener("touchend", touchEnd);

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

function createItemButton(itemObject) {
  let newButton = document.createElement('button');
  let el = document.getElementById("divItems");
  el.appendChild(newButton);

  el.addEventListener("touchstart", touchStart);
  el.addEventListener("touchend", touchEnd);

  if (itemObject.type == "c") {
    buttonColor = `btn btn-primary`;
  } else {
    buttonColor = `btn btn-success`;
  }

  buttonId = "item_" + itemObject.id;

  theHTML = `<button id="${buttonId}" onClick=buttonSelected("${buttonId}")  ondblclick=setCurrentRoot("${itemObject.id}")    class="${buttonColor}" style="margin:3px">${itemObject.name}</button>`;

  newButton.outerHTML = theHTML;
  return buttonId;

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

  for (let j = 0; j < gChainArray.length; j++) {
    thisId = gChainArray[j];
    thisItemObject = getItemObjectById(thisId);
    // need thisButton?
    thisButton = createChainButton(thisItemObject);

    //  b = createTreeButton(thisItemObject);



  }

  let kids = [];
  gid("divItems").innerHTML = "";
  for (i = 0; i < gItemArray.length; i++)
    if (gItemArray[i].parentId == getCurrentParentId())
      kids.push(gItemArray[i]);

  if (kids.length > 0) {
    kids.sort(compare);
  }

  for (i = 0; i < kids.length; i++)
    createItemButton(kids[i]);



}


function downloadData() {
  let js = localStorage.getItem(json.value);
  //  let str = JSON.stringify(js);
  let str = js;


  var data = new Blob([str]);
  var a = document.getElementById('a');
  a.href = URL.createObjectURL(data);

  a.click();

  showAlert("Downloaded " + json.value)
}



function gridPhotoClicked(id) {

  if (id == 0) {
    chain_0.click();
    return;
  }

  let thisItemObject = getItemObjectById(id);


  setCurrentRoot(thisItemObject.parentId);

  let bs = document.getElementsByClassName("hasFocus");

  for (i = 0; i < bs.length; i++) {

    bs[i].classList.remove("hasFocus");
  }


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

      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid" style="font-size:10px" onclick="gridPhotoClicked('${thisItemObject.id}')">`
        + thisItemObject.name + `</button>`;

    }

    else {
      let newButton = document.createElement('button');

      el.appendChild(newButton);

      newButtonId = "image_" + thisItemObject.id;

      //
      // take care of rotation
      //

      newButton.outerHTML = `<button id= "${newButtonId}" class="item-grid"  onclick="gridPhotoClicked('${thisItemObject.id}')"> 
      <img src="` + thisItemObject.image + `" style="transform:rotate(0deg)"  ></button>`;

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

/*
function toJSON() {
  const myJSON = JSON.stringify(gItemArray);
  // Store
  localStorage.setItem("jsonString", myJSON);
  showAlert("defunct");
}*/


function getJSON() {
  let js = localStorage.getItem(json.value);

  gItemArray = JSON.parse(js);

  setCurrentRoot(0);
  showAlert("done get " + json.value);
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
  localStorage.clear();

  showAlert("done clear");
  refreshJSON();
}



// FILE UPLOAD STUFF
function uploadImageFile() {
  // debugger;
  var files = file.files;

  if (files.length > 0) {

    let idValue = getFormValue('inItemId');

    let el = gid("image_" + idValue);
    el.children[0].src = "";

    thePhoto.src = "";

    let theItemObject = getItemObjectById(idValue);

   // theItemObject.image = "";

    var formData = new FormData();
    let theDir = "photos";

    formData.append("file", files[0]); // this passes the filename to PHP


    // make up name of file


    var xhttp = new XMLHttpRequest();

    let req = "./uploadincitio.php?dir=" + theDir + "&stamp=" + inItemId.value;
    // let req = "./uploadincitio.php?dir=" + theDir + "&stamp=" + Date.now();

    xhttp.open("POST", req, true);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        var response = this.responseText;
        if (response == 1) {

          alert("File not uploaded. ");

        } else {

          thePhoto.src = response; // + "?" + Date.now(); // here's the display
          el.children[0].src = thePhoto.src;

          theItemObject.image = response;

          // the grid needs a boot also
          // take care if not jpg!!!!!
          //  theItemObject.image = theDir + "/image_" + theItemObject.id + ".jpg?" +  Date.now();;

          //    showAllItems();

          //el.children[0].src = thePhoto.src + '1';
        }
      }

    };

    // Send request with data
    xhttp.send(formData);
  } else {
    showAlert("Please select a file");
  }
}

function xuploadImageFile() {
  function resize() {
    //define the width to resize e.g 600px
    var resize_width = 200;//without px

    //get the image selected
    var item = file.files[0];

    //create a FileReader
    var reader = new FileReader();

    //image turned to base64-encoded Data URI.
    reader.readAsDataURL(item);
    reader.name = item.name;//get the image's name
    reader.size = item.size; //get the image's size
    reader.onload = function (event) {
      var img = new Image();//create a image
      img.src = event.target.result;//result is base64-encoded Data URI

      //  alert(img.src.length);

      img.name = event.target.name;//set name (optional)
      img.size = event.target.size;//set size (optional)
      img.onload = function (el) {
        var elem = document.createElement('canvas');//create a canvas

        //scale the image to 600 (width) and keep aspect ratio
        var scaleFactor = resize_width / el.target.width;
        elem.width = resize_width;
        elem.height = el.target.height * scaleFactor;

        //draw in canvas
        var ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

        //get the base64-encoded Data URI from the resize image
        var srcEncoded = ctx.canvas.toDataURL('image/png', 1);

        //assign it to thumb src
        thePhoto.src = srcEncoded;
        //   alert(srcEncoded.length);

        /*Now you can send "srcEncoded" to the server and
        convert it to a png o jpg. Also can send
        "el.target.name" that is the file's name.*/

        /*Also if you want to download tha image use this*/
        /*
        var a = document.createElement("a"); //Create <a>
        a.href =  srcEncoded; //set srcEncoded as src
        a.download = "myimage.png"; //set a name for the file
        a.click();
        
        */


        let idValue = getFormValue('inItemId');
        let theItemObject = getItemObjectById(idValue);

        theItemObject.image = srcEncoded;

        showAllItems();

      }
    }
  }



  resize();
}


noImage = "./images/noimage.jpg";

