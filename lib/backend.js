
const Disk = {
  saveData() {

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

  loadData() {

    const xhttp = new XMLHttpRequest();
    let req = "loaddatafromdisk.php";
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
      showAlert("done load from disk ","extra");

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

function loadDataFromDisk() {
  Disk.loadData();
}

// FILE UPLOAD STUFF
function uploadImageFile() {

  Disk.uploadImage();
}


function createUser() {
  //  let newUser = prompt("create user");
  //  if (!newUser)
  //   return;

  let newUser = User.get();

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "createuser.php");
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.onload = function () {
    showAlert(this.responseText);
    loadTestData();
    saveDataToDisk();
  }
  xhttp.send("user=" + newUser);
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



// Disk operations to load or save data
function downloadData() {
  Disk.downloadData();
}




// This will be replaced when the use id code is working
function loadTestData() {
debugger;
  let js = `[{"id":"0","type":"c","parentId":"?","name":"home","description":"your humble abode","image":"photos/0.jpg"},{"id":"1725836216928","type":"c","parentId":"0","name":"My Study","description":"My den","image":"photos/1725836216928.jpg"},{"id":"1725836247926","type":"c","parentId":0,"name":"Kitchen","description":"Where the food is","image":"photos/1725836247926.jpg"},{"id":"1725836282864","type":"c","parentId":"1725836247926","name":"Fridge","description":"Fridge description","image":"photos/1725836282864.jpg"},{"id":"1725836311136","type":"c","parentId":"1725836247926","name":"Kitchen cupboard","description":"Kitchen cupboard description","image":"photos/1725836311136.jpg"},{"id":"1725836340744","type":"c","parentId":"1725836311136","name":"Shelf1","description":"Shelf1 description","image":"photos/1725836340744.jpg"},{"id":"1725836350832","type":"c","parentId":"1725836311136","name":"Shelf2","description":"Shelf2 description","image":"photos/1725836350832.jpg"},{"id":"1725836362504","type":"c","parentId":"1725836311136","name":"Shelf3","description":"Shelf3 description","image":"photos/1725836362504.jpg"},{"id":"1725836416633","type":"c","parentId":"1725836216928","name":"Small Tools","description":"Small Tools description","image":"photos/1725836416633.jpg"},{"id":"1725836714777","type":"i","parentId":"1725836416633","name":"Magnifying glass","description":"Magnifying glass description","image":"photos/1725836714777.jpg"},{"id":"1725836778378","type":"i","parentId":"1725836416633","name":"Hand Clamp","description":"Small plastic clamp","image":"photos/1725836778378.jpg"},{"id":"1725836849233","type":"i","parentId":"1725836416633","name":"Scissors","description":"Scissors description","image":"photos/1725836849233.jpg"},{"id":"1725837016010","type":"i","parentId":"1725836416633","name":"Magnetic Hand","description":"Pick up small screws","image":"photos/1725837016010.jpg"},{"id":"1725837606726","type":"i","parentId":"1725836416633","name":"G Clamp","description":"G Clamp description","image":"photos/1725837606726.jpg"},{"id":"1725845183755","type":"c","parentId":"1725836216928","name":"common tools","description":"common tools description","image":"photos/1725845183755.jpg"},{"id":"1725845205412","type":"i","parentId":"1725845183755","name":"Adjustable spanner","description":"Adjustable spanner description","image":"photos/1725845205412.jpg"},{"id":"1725845258140","type":"i","parentId":"1725845183755","name":"Leather hole punch","description":"Leather hole punch description","image":"photos/1725845258140.jpg"},{"id":"1725845412484","type":"i","parentId":"1725845183755","name":"Simple Hack saw","description":"Simple Hack saw description","image":"photos/1725845412484.jpg"},{"id":"1725845530318","type":"i","parentId":"1725845183755","name":"Mexican spanner","description":"Mexican spanner description","image":"photos/1725845530318.jpg"},{"id":"1725845752742","type":"c","parentId":"1725836216928","name":"Papeleria","description":"Papeleria description","image":"photos/1725845752742.jpg"},{"id":"1725845863663","type":"i","parentId":"1725845752742","name":"Ruler","description":"Ruler description","image":"photos/1725845863663.jpg"},{"id":"1725845908144","type":"i","parentId":"1725845752742","name":"Pens","description":"Pens description","image":"photos/1725845908144.jpg"},{"id":"1725845948414","type":"i","parentId":"1725845752742","name":"Pencil Sharpeners","description":"Pencil Sharpeners description","image":"photos/1725845948414.jpg"},{"id":"1725846011336","type":"i","parentId":"1725845752742","name":"Plasticine","description":"Plasticine description","image":"photos/1725846011336.jpg"},{"id":"1725846365857","type":"i","parentId":"1725845752742","name":"Staples","description":"Staples description","image":"photos/1725846365857.jpg"},{"id":"1725909589897","type":"c","parentId":"1725836216928","name":"box of screwdrivers","description":"box of screwdrivers description","image":"photos/1725909589897.jpg"},{"id":"1725909799947","type":"i","parentId":"1725909589897","name":"flat heads","description":"Regular screw drivers","image":"photos/1725909799947.jpg?1728848862292"},{"id":"1725910219318","type":"i","parentId":"1725909589897","name":"cross heads","description":"cross heads description","image":"photos/1725910219318.jpg?1728851037933"},{"id":"1725925895037","type":"c","parentId":"1725836216928","name":"Glue Box","description":"Glue Box description","image":"photos/1725925895037.jpg?1728851051609"},{"id":"1725925990470","type":"i","parentId":"1725925895037","name":"Big Glue Gun","description":"Big Glue Gun description","image":"photos/1725925990470.jpg?1728851072465"},{"id":"1725926011742","type":"i","parentId":"1725925895037","name":"Small Glue Gun","description":"Small Glue Gun description","image":"photos/1725926011742.jpg?1728851108292"},{"id":"1725926058517","type":"i","parentId":"1725925895037","name":"Spare Glue Sticks","description":"Spare Glue Sticks description","image":"photos/1725926058517.jpg?1728851128899"},{"id":"1725926086883","type":"i","parentId":"1725925895037","name":"Plastic Steel","description":"Plastic Steal description","image":"photos/1725926086883.jpg?1728851142074"},{"id":"1726344113129","type":"c","parentId":"0","name":"Master Bedroom","description":"Bedroom description","image":"photos/1726344113129.jpg?1728851155747"},{"id":"1726344133731","type":"c","parentId":0,"name":"Visitors Room","description":"Visitors Room description","image":"photos/1726344133731.jpg?1728851180285"},{"id":"1726344242065","type":"c","parentId":0,"name":"Living Room","description":"Living Room description","image":"photos/1726344242065.jpg?1728851192848"},{"id":"1726345604982","type":"c","parentId":0,"name":"Bodegas","description":"Bodegas description","image":"photos/1726345604982.jpg?1728851213833"},{"id":"1726345629422","type":"c","parentId":"1726345604982","name":"Front Porch Bodega","description":"Front Porch Bodega description","image":"photos/1726345629422.jpg?1728851228901"},{"id":"1726345644802","type":"c","parentId":"1726345604982","name":"Back Bodega","description":"Back Bodega description","image":"photos/1726345644802.jpg?1728851239855"},{"id":"1726345661718","type":"c","parentId":"0","name":"Henry House","description":"Henry House description","image":"photos/1726345661718.jpg?1728851314771"},{"id":"1726345682710","type":"c","parentId":"0","name":"Alberca Toilet","description":"Alberca Toilet description","image":"photos/1726345682710.jpg?1728851322414"},{"id":"1726345703720","type":"c","parentId":"0","name":"Kitchen Toilet","description":"Kitchen Toilet description","image":"photos/1726345703720.jpg"},{"id":"1726345717145","type":"c","parentId":"0","name":"Back Terrace","description":"Back Terrace description","image":"photos/1726345717145.jpg?1728851594483"},{"id":"1726345726080","type":"c","parentId":"0","name":"Front Terrace","description":"Front Terrace description","image":"photos/1726345726080.jpg?1728851863924"},{"id":"1726345742273","type":"c","parentId":"0","name":"Entrance","description":"Entrance description","image":"photos/1726345742273.jpg?1728851879001"},{"id":"1726345808634","type":"c","parentId":"0","name":"Master Toilet","description":"Master Toilet description","image":"photos/1726345808634.jpg?1728851904339"},{"id":"1726345817514","type":"c","parentId":"0","name":"Lady Toilet","description":"Lady Toilet description","image":"photos/1726345817514.jpg?1728852032312"},{"id":"1726345854639","type":"c","parentId":"0","name":"Inside Passage","description":"Inside Passage description","image":"photos/1726345854639.jpg?1728852134346"},{"id":"1726345899970","type":"c","parentId":"1725836216928","name":"Big Desk","description":"Big Desk description","image":"photos/1726345899970.jpg?1728852146689"},{"id":"1726345920704","type":"c","parentId":"1725836216928","name":"Blue Cabinet","description":"Blue Cabinet description","image":"photos/1726345920704.jpg?1728852154735"},{"id":"1726345933256","type":"c","parentId":"1725836216928","name":"Wall Stand","description":"Wall Stand description","image":"photos/1726345933256.jpg?1728852183284"},{"id":"1726345943818","type":"i","parentId":"1725836216928","name":"Bed","description":"Bed description","image":"photos/1726345943818.jpg"},{"id":"1726345980896","type":"c","parentId":"1725836216928","name":"Work Table","description":"Work Table description","image":"photos/1726345980896.jpg"},{"id":"1726345997504","type":"c","parentId":"1725836216928","name":"Shoe Rack","description":"Shoe Rack description","image":"photos/1726345997504.jpg?1728852298527"},{"id":"1726346033040","type":"i","parentId":"1726345899970","name":"Mini Computer","description":"Mini Computer description","image":"photos/1726346033040.jpg?1728852312626"},{"id":"1726346057688","type":"i","parentId":"1726345899970","name":"Monitor Speakers","description":"Monitor Speakers description","image":"photos/1726346057688.jpg?1728852322058"},{"id":"1726346082968","type":"i","parentId":"1726345899970","name":"Sony TV","description":"Sony TV description","image":"photos/1726346082968.jpg?1728852813191"},{"id":"1726346104248","type":"i","parentId":"1726345899970","name":"Behringer Interface","description":"Behringer  description","image":"photos/1726346104248.jpg?1728852822811"},{"id":"1726346155927","type":"i","parentId":"1726345899970","name":"Lamp","description":"Lamp description","image":"photos/1726346155927.jpg"},{"id":"1726346176497","type":"i","parentId":"1726345899970","name":"USB hub 1","description":"USB hub 1 description","image":"photos/1726346176497.jpg?1728852854464"},{"id":"1726346185673","type":"i","parentId":"1726345899970","name":"USB hub2","description":"USB hub2 description","image":"photos/1726346185673.jpg?1728852863075"},{"id":"1726346195041","type":"i","parentId":"1726345899970","name":"Usb Hub3","description":"Usb Hub3 description","image":"photos/1726346195041.jpg?1728852871152"},{"id":"1726347526694","type":"i","parentId":"1726344113129","name":"Bed","description":"Bed description","image":"photos/1726347526694.jpg?1728852885947"},{"id":"1726347538816","type":"i","parentId":"1726344113129","name":"Bathtub","description":"Bathtub description","image":"photos/1726347538816.jpg?1728852900596"},{"id":"1726347546681","type":"i","parentId":"1726344113129","name":"Wash basin","description":"Wash basin description","image":"photos/1726347546681.jpg?1728852978948"},{"id":"1726347563352","type":"c","parentId":"1726344113129","name":"Wardrobe 1","description":"Wardrobe 1 description","image":"photos/1726347563352.jpg?1728852989704"},{"id":"1726347594829","type":"c","parentId":"1726344113129","name":"Wardrobe 2","description":"Wardrobe 2 description","image":"photos/1726347594829.jpg?1728852999858"},{"id":"1726347614361","type":"c","parentId":"1726347563352","name":"Trousers","description":"Trousers description","image":"photos/1726347614361.jpg?1728853020762"},{"id":"1726347631630","type":"i","parentId":"1726347614361","name":"decathlon trousers","description":"decathlon trousers description","image":"photos/1726347631630.jpg?1728853049359"},{"id":"1726347646086","type":"i","parentId":"1726347614361","name":"Short trousers","description":"Short trousers description","image":"photos/1726347646086.jpg?1728853059679"},{"id":"1726347662086","type":"i","parentId":"1726347614361","name":"Best Trousers","description":"Best Trousers description","image":"photos/1726347662086.jpg?1728853069102"},{"id":"1727269713953","type":"c","parentId":"1725836216928","name":"Electrical Repairs","description":"Electrical Repairs description","image":"photos/1727269713953.jpg?1728853083463"},{"id":"1727269937313","type":"i","parentId":"1727269713953","name":"Insulation Tape","description":"Black tape that goes sticky in hot weather","image":"photos/1727269937313.jpg"},{"id":"1727269979234","type":"i","parentId":"1727269713953","name":"Electrition Screwdriver","description":"Electrition Screwdriver description","image":"photos/1727269979234.jpg"},{"id":"1727270011400","type":"i","parentId":"1727269713953","name":"Wire Strippers","description":"Wire Strippers description","image":"photos/1727270011400.jpg"},{"id":"1727270034963","type":"i","parentId":"1727269713953","name":"Precision Tools","description":"Precision Tools description","image":"photos/1727270034963.jpg"},{"id":"1727270072755","type":"i","parentId":"1727269713953","name":"Multimeter","description":"Multimeter description","image":"photos/1727270072755.jpg"},{"id":"1727270113692","type":"i","parentId":"1727269713953","name":"Spare Leads","description":"Spare Leads description","image":"photos/1727270113692.jpg"},{"id":"1727270164505","type":"i","parentId":"1727269713953","name":"Cutters","description":"Cutters description","image":"photos/1727270164505.jpg"},{"id":"1727270202659","type":"i","parentId":"1727269713953","name":"Cable Connectors","description":"Cable Connectors description","image":"photos/1727270202659.jpg"},{"id":"1727270235818","type":"i","parentId":"1727269713953","name":"Needlenosed pliers","description":"Needlenosed pliers description","image":"photos/1727270235818.jpg"},{"id":"1727312817207","type":"c","parentId":"1725836247926","name":"Freezer","description":"Freezer description","image":"photos/1727312817207.jpg"},{"id":"1727312881011","type":"i","parentId":"1727312817207","name":"Beans","description":"Beans description","image":"photos/1727312881011.jpg"},{"id":"1729374998139","type":"c","parentId":"1725836247926","name":"unNamed","description":"unNamed description","image":"?"},{"id":"1729375004379","type":"c","parentId":"1725836247926","name":"unNamed","description":"unNamed description","image":"?"},{"id":"1729375007275","type":"i","parentId":"1725836247926","name":"unNamed","description":"unNamed description","image":"?"},{"id":"1729380368219","type":"i","parentId":0,"name":"unNamed","description":"unNamed description","image":"?"}]`;

  gItemArray = JSON.parse(js);

  paintBreadCrumbs(0);
  showAlert("loaded test data");
  showAllItems();

  chain_0.click();
}
