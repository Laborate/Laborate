<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['user_email']) && isset($_POST['user_password'])) {
    function createId() {
        require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
        $continue = true;
        while($continue == true) {
            $id = rand(101, 999999999999999999) - rand(1, 100);
            $query_Sessions = "SELECT * FROM users WHERE users.user_id = '".$id."'";
            $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
            $row_Sessions = mysql_fetch_assoc($Sessions);
            if(is_null($row_Sessions['user_id'])) { $continue = false; }
        }
       return $id;
    }

    $id = createId();
    $insertSQL = sprintf("INSERT INTO users (user_id, user_name, user_email, user_password, user_activated,
                                            user_locations, user_github, user_screen_name) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
    				   $id,
    				   GetSQLValueString($_POST['user_name'], "text"),
    				   GetSQLValueString($_POST['user_email'], "text"),
    				   GetSQLValueString($_POST['user_password'], "text"),
    				   rand(101, 99999999),
    				   GetSQLValueString("[]", "text"),
    				   GetSQLValueString("[]", "text"),
    				   GetSQLValueString(explode(" ", $_POST['user_name'])[0], "text"));

    $Sessions = mysql_query($insertSQL , $database) or die(mysql_error());
    $_SESSION['userId'] = $id;
    $_SESSION['userName'] = $_POST['user_name'];
    echo 1;
}
?>