<?php
 
if(isset($_GET['dir'])) {
    $dir = $_GET['dir'];
}

if(!is_dir($dir)){
  echo 'error no directory ';
    die($dir);
}

 global $uploaded;

function cropAndRename($fileName)
{
  //  echo "filename - " . $fileName;
    global $dir;
    global $uploaded;
    $stamp = time(); 
 
    $uploaded = $dir . '/img_' . $stamp  . '.jpg';
    $thumb = $dir . '/tn_img_' . $stamp  . '.jpg';
    rename($fileName,$uploaded);

    // is this ok
    $img = imagecreatefromjpeg($uploaded);
    //list($width, $height) = getimagesize($uploaded);

    $width = imagesx($img);
    $height = imagesy($img);

    $new_width =   80; //$width * 0.5;
    $new_height = $height * $new_width / $width;
    $newImg = imagecreatetruecolor($new_width, $new_height);

    imagecopyresampled($newImg, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
    imagejpeg($newImg, $thumb);


    // now resize the image
    if($width>500){
        $new_width =   500; //$width * 0.5;
        $new_height = $height * $new_width / $width;
        $newImg = imagecreatetruecolor($new_width, $new_height);

        imagecopyresampled($newImg, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
        imagejpeg($newImg, $uploaded);
  
    }

    imagedestroy($img);
     
 
}


if (isset($_FILES['file']['name'])) {
    // file name
    $filename = $_FILES['file']['name'];

    // Location
    $location = $dir . '/' . $filename;

    // file extension
    $file_extension = pathinfo($location, PATHINFO_EXTENSION);
    $file_extension = strtolower($file_extension);

    // Valid image extensions
    $valid_ext = array("pdf", "doc", "docx", "jpg", "png", "jpeg");

    $response = 1;
    if (in_array($file_extension, $valid_ext)) {
        // Upload file
        if (move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
            cropAndRename($location);
             
        }
    }
 
   echo $uploaded;
 
    exit;
}
