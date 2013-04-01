<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_POST['user_email']) && isset($_POST['user_password'])) {
    $query_Sessions = "SELECT * FROM users, pricing WHERE users.user_pricing = pricing.pricing_id AND users.user_email = '".$_POST['user_email']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);
    $totalRows_Sessions = mysql_num_rows($Sessions);

    if($row_Sessions['user_email'] == $_POST['user_email']) {
        if($row_Sessions['user_password'] == aesEncrypt($_POST['user_password'], $_SESSION['cryptSalt'])) {
            $_SESSION['user'] = "user_id";

            $uuid = gen_uuid();
            setcookie('USRRC', $uuid, time()+1209600, "/");

            $insertSQL = sprintf("INSERT INTO login ( login_uuid, login_user_id ) VALUES (%s, %s)",
            GetSQLValueString($uuid, "text"), $row_Sessions['user_id']);
            $Sessions = mysql_query($insertSQL , $database) or die(mysql_error());
        }
        else {
            echo "User Login: Failed";
        }
    }
    else {
        echo "User Login: Failed";
    }
}
?>