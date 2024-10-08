<?php

if (isset($_GET['dir'])) {
    $dir = $_GET['dir'];
}

if (!is_dir($dir)) {
    echo 'error no directory ';
    die($dir);
}

global $uploaded;

function cropAndRename($fileName, $file_extension)
{
    //  echo "filename - " . $fileName;
   // if ($file_extension == "jpg")
     //   $exif_info =  exif_read_data($fileName);


    // read orientation, my camera returns 6.

    global $dir;
    global $uploaded;
    $stamp = time();

    $uploaded = $dir . '/img_' . $stamp  . '.' . $file_extension;
    //  $thumb = $dir . '/tn_img_' . $stamp  . '.jpg';
    rename($fileName, $uploaded);

    // is this ok
    if ($file_extension == 'jpg')
        $img = imagecreatefromjpeg($uploaded);
    else
        $img = imagecreatefrompng($uploaded);




    // $exif_info = var_dump(exif_read_data($filename));


    // read orientation, my camera returns 6.

    /* 


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
    if ($width > 500) {
        $new_width =   500; //$width * 0.5;
        $new_height = $height * $new_width / $width;
        $newImg = imagecreatetruecolor($new_width, $new_height);

        imagecopyresampled($newImg, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

        $rot = imagerotate($newImg, 270, 0);

        if ($file_extension == 'jpg')
            imagejpeg($rot, $uploaded);
        elseif ($file_extension == 'png')
            imagepng($rot, $uploaded);
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
            cropAndRename($location, $file_extension);
        }
    }

    echo $uploaded;

    exit;
}
