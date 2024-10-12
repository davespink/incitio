<?php


$filename = 'mypic.jpg';
$img = imagecreatefromjpeg($filename);


$exif_info = var_dump(exif_read_data($filename));


// read orientation, my camera returns 1.

/* 

 string(13) "Galaxy A15 5G"
  ["Orientation"]=>
  int(1)

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

$new_width =   500; //$width * 0.5;
$new_height = $height * $new_width / $width;
$newImg = imagecreatetruecolor($new_width, $new_height);

imagecopyresampled($newImg, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

$rot = imagerotate($newImg, 0, 0);
$uploaded = 'umypic.jpg';

imagejpeg($rot, $uploaded);



imagedestroy($img);


exit;
