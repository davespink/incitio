<?php




if (isset($_GET['user'])) {
    $user = $_GET['user'];
}


function doLog($str)
{

    file_put_contents("phpLog.txt", $str . "\n", FILE_APPEND);
}

$fileName = "autosave_" . $user . ".txt";
doLog($fileName);

try {
    $js = file_get_contents($fileName);
    echo $js;
} catch (Exception $e) {
    echo $e;
}
