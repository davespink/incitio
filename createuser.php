<?php
$user = $_POST['user'];
 
$file = "0.jpeg";

@mkdir("users");
@mkdir("users/" . $user);
@mkdir("users/" . $user . "/photos");
 

/*
copy("photos/" . $file , "users/" . $user . "/photos/" . $file);

// iterate directory
$dir = new DirectoryIterator("photos");
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot()) {
        $file = ($fileinfo->getFilename());
// var_dump($file);
        copy("photos/" . $file , "users/" . $user . "/photos/" . $file);
    }
}
*/


echo "0_created user " . $user;
?>