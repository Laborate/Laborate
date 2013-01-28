<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

function redirect() {
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' ) {
        echo $GLOBALS['ajax_message'];
        exit;
    } else {
        header("Location: /login?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
        exit;
    }

}

$query_Sessions = "SELECT * FROM users WHERE users.user_id = '".$_SESSION['userId']."'";
$Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
$row_Sessions = mysql_fetch_assoc($Sessions);

if(isset($_SESSION['userId'])) {
    if($row_Sessions['user_id'] != $_SESSION['userId']) {
        redirect();
    }
}
else { redirect(); }
?>