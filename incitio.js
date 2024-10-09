



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
  let searchInput = gid("search");
  showAlert("not yet coded");
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
    //     alert(gItemArray[i].id);
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


    // b.addEventListener("onmouseover", alert("xxx"));
    // b.addEventListener("onmouseout", alert("yy"));

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
  function resize(){
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
    reader.onload = function(event) {
      var img = new Image();//create a image
      img.src = event.target.result;//result is base64-encoded Data URI
    
    //  alert(img.src.length);
      
      img.name = event.target.name;//set name (optional)
      img.size = event.target.size;//set size (optional)
      img.onload = function(el) {
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






noImage = `data:image/png;base64,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u6557DddtuJn8+ePRu//e1vBYi9QRrxZ5wvAU9g9P6udDot3vHwww/j+uuvFyc7B7kzuQv/299x3XXX4aKLLhIHCt+z3nrr4bLLLgO5MZ9DsGYPckcChSCZOnWqoO1wGcMCINwMG2+8cRdNSfA77rgDJ554YpdIwo102mmnCYB44lhvgOyxxx646qqrxGbuvYi9F4xA+fzzz7Hpppv24FS9ryNAuPDeCd/XwlM05AaZMWOGEKdee+01bLPNNl0AOf/888V3ZQ9+F7nl9ttvnxMghmEIYEyePDkn4HvPhxzlnnvuEXQiaAsByA033CDe19raKt754YcfCmD2h6a89uijjwYPueEwhiVASFiKV7/85S/F6cqxOICsvfba4uTcaaedutaFusZnn30muITP58Nqq60mFtrTC3jhP//5T+y9994gF8g1egOEosxdd90lRBqKGYcccgg222yzrs3z+uuv49hjj8X//ve/IQEIxURyWOozHDw8yAH5XXPnzkVdXZ3QRyhyeQcHQfKXv/xFiEnkALvvvrvgOhzkvieccAI233xzMWdeS45BbkcacXz77bfi+RRLKbJ53I3/5vVff/21+H7SjIcRxWPv+byfYuQxxxyDWbNmFT1Ghi1ASFkuxLbbbitk7L4Awg1P2Zy6i7dJeHqS41Du9wY30UknnYQ///nPqK6W7Y950lN8yaXL8Pe9AULdgPdT7PJ+/9FHH3XpUBRt+LyXXnpp0AAh93j++eex4447indxQ3Ijk3N+8MEHXUo09aPp06cLoHubnIo7NzZplz0ImEceeQQHHHCAAAgPEW5mcp3e46ijjgL1PA6CgyIc9UVyQYpfHJwjDwRyLM+Y4dGUIic5dTGPYQcQnpAiRTWjO3AxeOJxMfOJWCuttJKQ7XlScvCUO/PMM4WSTNk8e9Dyc/PNN4sNwsXlAj7++OOCE/DdvcfiAELgUqndeeedxa3ckHwWlfZsEWvBggW45JJLMHPmzB6iCsHNDbv11luL+7N1EHLFt99+G9RBOGiBO/nkk4VI1nuQ09CYsOWWW4pf8bs5D35b9uABQj1l//33XyxAyLk87sFNT3pShMxW3vlscjcePAQJacrx2GOP4fe///2ALIbLAkjDDiCUe7nBKTpwMcPhMI488kixKfIBhGz+X//6FwgUji+//BL77ruv2FC5xuGHH47LL78c9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`;

