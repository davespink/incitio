<?php
$data = $_POST['data'];
 
file_put_contents("test.txt",$data);


echo "data saved";


?>