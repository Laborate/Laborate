<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['user_email']) && isset($_POST['user_password'])) {
    $query_Sessions = "SELECT * FROM users WHERE users.user_email = '".$_POST['user_email']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);
    $totalRows_Sessions = mysql_num_rows($Sessions);

    if($row_Sessions['user_email'] == $_POST['user_email']) {
        if($row_Sessions['user_password'] == crypt($_POST['user_password'], $_SESSION['cryptSalt'])) {
            $_SESSION['userId'] = $row_Sessions['user_id'];
            $_SESSION['userName'] = $row_Sessions['user_name'];
            $_SESSION['userEmail'] = $row_Sessions['user_email'];
            $_SESSION['userLevel'] = $row_Sessions['user_level'];
            if(!is_null($row_Sessions['user_github'])) {
                $_SESSION['userGithub'] = aesDecrypt($row_Sessions['user_github'], $_SESSION['cryptSalt']);
            } else {
                $_SESSION['userGithub'] = $row_Sessions['user_github'];
            }

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