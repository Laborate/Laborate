<?php
$GLOBALS['ajax_message'] = "";
$GLOBALS['ajax_only'] = true;
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

$files_array = array();

do {
    if($GLOBALS['row_Sessions']['session_owner'] != $_SESSION['userId']) {
        if(!in_array($_SESSION['userId'], json_decode($GLOBALS['row_Sessions']['session_editors']))) { continue; }
    }

    if($GLOBALS['row_Sessions']['session_owner'] == $_SESSION['userId']) { $ownership = "owner"; }
    else { $ownership = "editor"; }

    if(is_null($GLOBALS['row_Sessions']['session_password'])) { $protected = "open"; }
    else { $protected = "password"; }

    $values = array("id" => $GLOBALS['row_Sessions']['session_id'], "protection" => $protected,
                    "ownership" => $ownership, "title" => $GLOBALS['row_Sessions']['session_name']);

    array_push($files_array, $values);

} while ($GLOBALS['row_Sessions'] = mysql_fetch_assoc($GLOBALS['Sessions']));

echo json_encode($files_array)
?>