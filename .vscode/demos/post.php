<?php
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $age = $_POST['age'];

    if (empty($name)) 
        echo "Please enter name";
    elseif(empty($age))
        echo "Please enter age";
    else
    //    echo "$name is $age years old.";

        file_put_contents("mytest.txt", $name . $age);
        echo "<script>alert('x');</script>";
  }
?>