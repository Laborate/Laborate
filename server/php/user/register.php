<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_POST['user_email']) && isset($_POST['user_password'])) {
    function createId() {
        require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');
        $continue = true;
        while($continue == true) {
            $id = rand(0, 9999999999999) + rand(0, 999999999);
            $query_Sessions = "SELECT * FROM users WHERE users.user_id = '".$id."'";
            $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
            $row_Sessions = mysql_fetch_assoc($Sessions);
            if(is_null($row_Sessions['user_id'])) { $continue = false; }
        }
       return $id;
    }

    $id = createId();
    $insertSQL = sprintf("INSERT INTO users (user_id, user_name, user_email, user_password, user_activated,
                                            user_locations, user_screen_name) VALUES (%s, %s, %s, %s, %s, %s, %s)",
    				   $id,
    				   GetSQLValueString($_POST['user_name'], "text"),
    				   GetSQLValueString($_POST['user_email'], "text"),
    				   GetSQLValueString(aesEncrypt($_POST['user_password'], $_SESSION['cryptSalt']), "text"),
    				   rand(101, 99999999), 'NULL',
    				   GetSQLValueString(explode(" ", $_POST['user_name'])[0], "text"));

    $Sessions = mysql_query($insertSQL , $database) or die(mysql_error());
    $_SESSION['user'] = $id;

    $hash = md5($id + $_POST['user_email'] + rand(0, 1000000000000000000000000));
    setcookie('userLogin', $hash, time()+1209600, "/");

    $insertSQL = sprintf("INSERT INTO login ( login_uuid, login_user_id ) VALUES (%s, %s)",
    GetSQLValueString($hash, "text"), $id);
    $Sessions = mysql_query($insertSQL , $database) or die(mysql_error());
    echo 1;
}
?>