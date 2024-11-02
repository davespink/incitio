<?php

if (isset($_GET['user'])) {
    $user = $_GET['user'];
}

$fileName = "autosave.txt";

if(null!==$user)
    $fileName = "users/" . $user . "/" . $fileName;
 
$js = file_get_contents($fileName);

echo $js;

 
?>