<?php
$GLOBALS['ajax_message'] = "Download: Failed";
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_GET['i'])) {

    $query_Sessions = "SELECT * FROM download, sessions WHERE sessions.session_id = download.session_id AND download.download_id = '".$_GET['i']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);

    $deleteSQL = sprintf("DELETE FROM download WHERE download.download_id = '".$_GET['i']."'");
    mysql_select_db($database_database, $database);
    $Result1 = mysql_query($deleteSQL, $database) or die(mysql_error());

    if($row_Sessions['download_id'] == $_GET['i']) {

        $fd = fopen($row_Sessions['session_name'], "rw");
        $path_parts = pathinfo($row_Sessions['session_name']);
        header("Content-Disposition: attachment; filename=\"".$path_parts["basename"]."\"");
        header("Content-type: application/octet-stream");
        header("Content-Disposition: filename=\"".$path_parts["basename"]."\"");
        header("Cache-control: private");

        $json = json_decode($row_Sessions['session_document']);

        if($json != null) {
            $code = "";
            foreach ($json as $line_num => $line) {
              if($line_num != count(json_decode($row_Sessions['session_document'])) - 1) {
                $code = $code.$line."\n";
              }
              else {
                $code = $code.$line;
              }
            }
            echo $code;
        } else { echo $GLOBALS['ajax_message']; }

    } else { echo $GLOBALS['ajax_message']; }
    fclose ($fd);
    exit;
}
?>
