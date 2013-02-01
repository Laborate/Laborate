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
        if($row_Sessions['user_password'] == crypt($_POST['user_password'], '$2a$07$usesomesillystringforsalt$')) {
            $_SESSION['userId'] = $row_Sessions['user_id'];
            $_SESSION['userName'] = $row_Sessions['user_name'];
            $_SESSION['userEmail'] = $row_Sessions['user_email'];
            $_SESSION['userLevel'] = $row_Sessions['user_level'];
            $_SESSION['userGithub'] = $row_Sessions['user_github'];
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