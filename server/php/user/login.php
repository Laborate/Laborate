<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['user_email']) && isset($_POST['user_password'])) {
    function createId() {
        require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
        $continue = true;
        while($continue == true) {
            $id = rand(101, 999999999999999999) - rand(1, 100);
            $query_Sessions = "SELECT * FROM user_reference WHERE user_reference.reference_id = '".$id."'";
            $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
            $row_Sessions = mysql_fetch_assoc($Sessions);
            if(is_null($row_Sessions['session_id'])) {$continue = false; }
        }
       return $id;
    }

    $query_Sessions = "SELECT * FROM users WHERE users.user_email = '".$_POST['user_email']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);
    $totalRows_Sessions = mysql_num_rows($Sessions);

    if($row_Sessions['user_email'] == $_POST['user_email']) {
        if($row_Sessions['user_password'] == $_POST['user_password']) {
            $_SESSION['userId'] = $row_Sessions['user_id'];
            $_SESSION['userName'] = $row_Sessions['user_name'];
            $_SESSION['userEmail'] = $row_Sessions['user_email'];
            $_SESSION['userLevel'] = $row_Sessions['user_level'];

            $referenceId = createId();
            $insertSQL = sprintf("INSERT INTO user_reference (reference_id, reference_user_id) VALUES (%s, %s)",
    				   $referenceId, $row_Sessions['user_id'],
    				   GetSQLValueString(json_encode(array()), "text"));

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