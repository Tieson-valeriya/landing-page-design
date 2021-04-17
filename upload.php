<?php
    // var_dump(file_get_contents($_FILES['file']['tmp_name']));
    // var_dump($_POST['name']);
    $name = $_POST['name'];
    $folderPath = 'uploads/';
    $audiofile = file_get_contents($_FILES['file']['tmp_name']);
    $audioName = $name.'.mp3';

    $audioFullPath = $folderPath.$audioName;
    
    file_put_contents($audioFullPath, $audiofile);

?>