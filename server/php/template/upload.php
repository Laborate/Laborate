<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
echo file_get_contents($_FILES['backdropUploadFile']['tmp_name']);
?>