<?php



$dir = new DirectoryIterator(dirname(__FILE__) . "/photos");
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot()) {
        $thisfile = $fileinfo->getFilename();

        $newfile = str_replace("image_", "", $thisfile);
        echo $newfile . "<br>";

        rename("photos/" . $thisfile, "photos/" . $newfile);
    }
}
