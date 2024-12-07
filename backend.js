
const Disk = {
  saveCurrentData() {
    const theData = JSON.stringify(gItemArray);

    const xhttp = new XMLHttpRequest();
    var req = "savedatatodisk.php";
    let user = User.get();
    if (user)
      req += "?user=" + user;
    ///alert(user + ' save');
    xhttp.open("POST", req);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {
      showAlert(this.responseText);
    }
    xhttp.send("data=" + theData);
  },

  loadCurrentData() {
    const xhttp = new XMLHttpRequest();
    let req = "loaduserdatafromdisk.php";
    let user = User.get();
    //   alert(user);
    if (user)
      req += "?user=" + user;
    xhttp.open("POST", req);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {
      //showAlert(this.responseText);
      gItemArray = JSON.parse(this.responseText);

      showAllItems();
      paintBreadCrumbs(0);
      showAlert("done load from disk ", "extra");

      chain_0.click();
    }
    xhttp.send();
  },


  loadData(file) {

    const xhttp = new XMLHttpRequest();
    let req = "loaddatafromdisk.php";

    //  let file = "testdata.txt";
    //   alert(user);

    req += "?filename=" + file;
    xhttp.open("POST", req);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {
      //showAlert(this.responseText);
      gItemArray = JSON.parse(this.responseText);

      showAllItems();
      paintBreadCrumbs(0);
      showAlert("done load test data from disk ", "extra");

      chain_0.click();
    }
    xhttp.send();

  },

  uploadImage() {
    var files = file.files;

    if (files.length > 0) {

      let idValue = getFormValue('inItemId');

      let el = gid("image_" + idValue);


      thePhoto.src = "";

      let theItemObject = getItemObjectById(idValue);

      var formData = new FormData();
      //let theDir = userDir();

      formData.append("file", files[0]); // this passes the filename to PHP

      // make up name of file

      var xhttp = new XMLHttpRequest();

      // produces a file with name same as object id + filetype
      //let req = "./uploadincitio.php?stamp=" + idValue;


      let dir = User.dir();

      if (dir.length > 0)
        dir = "users/" + dir + "/";
      else dir = "";

      stamp = idValue;

      // produces a file with name same as object id + filetype
      let req = "./uploadincitio.php?dir=" + dir + "&stamp=" + idValue;

      xhttp.open("POST", req, true);

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

          var response = this.responseText;
          if (response == 1) {
            alert("File not uploaded. ");
          } else {
            thePhoto.src = response;
            theItemObject.image = response;

            showAllItems();
            var delayInMilliseconds = 100; // 0.1 seconds

            setTimeout(function () {
              //xxx.click();
              thePhoto.src = forceImageLoad(thePhoto.src);
              theHoverPhoto.src = thePhoto.src;
            }, delayInMilliseconds); // to force a refresh .. hopefully
          }
        }
      };
      // Send request with data
      xhttp.send(formData);
    } else {
      showAlert("Please select a file");
    }


  },


  downloadData() {

    let js = JSON.stringify(gItemArray);

    var data = new Blob([js]);
    var a = document.getElementById('a'); // <-- this is defined near the download button
    a.href = URL.createObjectURL(data);

    a.click();

    showAlert("Downloaded " + a.download);



  },


}


function saveDataToDisk() {
  Disk.saveData();
}

//function loadUserDataFromDisk() {
//  Disk.loadUserData();
//}

// FILE UPLOAD STUFF
function uploadImageFile() {

  Disk.uploadImage();
}


function createUser() {

  let newUser = User.get();

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "createuser.php");
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.onload = function () {
    let resp = this.responseText;
    let a = resp.split("_"); // a[0] should be 0
    if (a[0] != "0") {
      alert("failed to create user - " + a[1]);
    }
    else
      loadTestData();
    //  saveDataToDisk();
  }
  xhttp.send("user=" + newUser);
}




// Disk operations to load or save data
function downloadData() {
  Disk.downloadData();
}

// This will be replaced when the use id code is working
function loadTestData() {

  // now comes from disk

  Disk.loadData("testdata.txt");

  paintBreadCrumbs(0);

  showAllItems();

  chain_0.click();

  showAlert("loaded test data");
}


////// no longer used ///////////

/*
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
 
let idValue = getFormValue('inItemId');
let theItemObject = getItemObjectById(idValue);
 
theItemObject.image = srcEncoded;
 
showAllItems();
 
}
}
}
 
resize();
}
*/



