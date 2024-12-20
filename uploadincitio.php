<?php

if (isset($_GET['stamp'])) {
    $stamp = $_GET['stamp'];
}

if (isset($_GET['dir'])) {
    $dir = $_GET['dir'];
} else $dir = "";

doLog("stamp dir" . $stamp . "-" .  $dir);

global $uploaded; //where to write to
global $stamp;

function doLog($str)
{

    file_put_contents("phpLog.txt", $str . "\n", FILE_APPEND);
}

function cropAndRename($fileName, $file_extension)
{

    //  doLog($file_extension);


    global $uploaded;
    global $stamp;
    global $dir;

    // $dir = "users/spot/";
    $uploaded = $dir . 'photos/' . $stamp  . '.' . $file_extension;

    doLog("uploaded - " . $uploaded);
    doLog("filename - " . $fileName);
    //  

    rename($fileName, $uploaded);

    //  doLog("rename - " + $fileName + "-" + $uploadTest);

    // is this ok
    if ($file_extension == 'jpg' ||  $file_extension == 'jpeg') {
        $img = imagecreatefromjpeg($uploaded);
        $exif = exif_read_data($uploaded);
        if (!empty($exif['Orientation'])) {
            switch ($exif['Orientation']) {
                case 3:
                    $img = imagerotate($img, 180, 0);
                    doLog("3");
                    break;

                case 6:
                    $img = imagerotate($img, -90, 0);
                    doLog("6");
                    break;

                case 8:
                    $img = imagerotate($img, 90, 0);
                    doLog("8");
                    break;
            }
        }
    } else
        $img = imagecreatefrompng($uploaded);

    doLog($fileName);


    // $exif_info = var_dump(exif_read_data($filename));


    // read orientation, my camera returns 6.

    /* 

    my phone returns "1" from exif.
    

    incase of problem with other cameras, here's what to do
    
1 = 0 degrees: the correct orientation, no adjustment is required.
2 = 0 degrees, mirrored: image has been flipped back-to-front.
3 = 180 degrees: image is upside down.
4 = 180 degrees, mirrored: image has been flipped back-to-front and is upside down.
5 = 90 degrees: image has been flipped back-to-front and is on its side.
6 = 90 degrees, mirrored: image is on its side.
7 270 degrees: image has been flipped back-to-front and is on its far side.
8 270 degrees, mirrored: image is on its far side.

*/

    $width = imagesx($img);
    $height = imagesy($img);


    // now resize the image
    if ($width > 200) {
        $new_width =   200; //$width * 0.5;
        $new_height = $height * $new_width / $width;
        $newImg = imagecreatetruecolor($new_width, $new_height);

        imagecopyresampled($newImg, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

        //  $rot = imagerotate($newImg, 0, 0);
        //$imposter = str_replace("image_", "imposter_", $uploaded);
        //   if ($file_extension == 'jpg');{
        // imagejpeg($rot, $uploaded);



        imagejpeg($newImg, $uploaded); // seems to work for png????
    }

    imagedestroy($img);
}

//
// starts here
//


if (isset($_FILES['file']['name'])) {
    // file name
    $filename = $_FILES['file']['name'];

    // Location
    $location = 'photos/' . $filename;

    // file extension
    $file_extension = pathinfo($location, PATHINFO_EXTENSION);
    $file_extension = strtolower($file_extension);

    // Valid image extensions
    $valid_ext = array("pdf", "doc", "docx", "jpg", "png", "jpeg");

    $response = 1;
    if (in_array($file_extension, $valid_ext)) {
        // Upload file
        if (move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
            cropAndRename($location, $file_extension);
        }
    }

    echo $uploaded;

    // $new= "./photos/imposter_" . $stamp .  ".jpg";

    // copy ($uploaded,$new);
    exit;
}
