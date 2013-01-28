<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['user_email'])) {
    $query_Sessions = "SELECT * FROM users WHERE users.user_email = '".$_POST['user_email']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);
    if(is_null($row_Sessions['user_id'])) { echo 1; }
}
?>