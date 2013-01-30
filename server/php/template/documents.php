<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

//Check for Delete or Forget
$query_Sessions = "SELECT * FROM sessions WHERE sessions.session_id = '".$GLOBALS['getVars']['i']."'";
$Action_Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
$row_Action_Sessions = mysql_fetch_assoc($Action_Sessions);

if($GLOBALS['getVars']['d'] == "1") {
    if($row_Action_Sessions['session_owner'] == $_SESSION['userId']) {
    	$Delete = "DELETE FROM sessions WHERE session_id='".$GLOBALS['getVars']['i']."'";
    	mysql_select_db($database_database, $database);
    	$delete_results = mysql_query($Delete, $database) or die(mysql_error());
    }
}

if($GLOBALS['getVars']['f'] == "1") {
    if(in_array($_SESSION['userId'], json_decode($row_Action_Sessions['session_editors']))) {
        $editors = json_decode($row_Action_Sessions['session_editors']);
        if($editors == null || $editors[0] == "") { $editors = array(); }
        if(in_array($_SESSION['userId'], $editors)) {
            unset($editors[key($editors)]);
        }
        $editors = json_encode($editors);
        $updateSQL = sprintf("UPDATE sessions SET session_editors=%s WHERE session_id=%s",
				   GetSQLValueString($editors, "text"),
				   $row_Action_Sessions['session_id']);
        $UpdateSessions = mysql_query($updateSQL , $database) or die(mysql_error());
    }
}

//Document Core Functions
function echoDocuments() {
    do {
        if($GLOBALS['row_Sessions']['session_owner'] != $_SESSION['userId']) {
            if(!in_array($_SESSION['userId'], json_decode($GLOBALS['row_Sessions']['session_editors']))) { continue; }
        }

        if($GLOBALS['row_Sessions']['session_owner'] == $_SESSION['userId']) { $ownership = "owner"; }
        else { $ownership = "editor"; }

        if(is_null($GLOBALS['row_Sessions']['session_password'])) { $protected = "open"; }
        else { $protected = "password"; }

        if(strlen($GLOBALS['row_Sessions']['session_name']) > 12) {
            $title = substr($GLOBALS['row_Sessions']['session_name'], 0, 10)."...";
        } else {
            $title = $GLOBALS['row_Sessions']['session_name'];
        }
        ?>
        <div id="file_<?php echo $GLOBALS['row_Sessions']['session_id']; ?>" class="file" data="<?php echo $GLOBALS['row_Sessions']['session_id']; ?>">
            <div class="file_attributes <?php echo $protected; ?>" data="<?php echo $protected; ?>">
                <?php echo $ownership; ?>
            </div>
            <div class="title" data="<?php echo $GLOBALS['row_Sessions']['session_name']; ?>">
                <?php echo $title ?>
            </div>
        </div>
    <?php } while ($GLOBALS['row_Sessions'] = mysql_fetch_assoc($GLOBALS['Sessions']));
}

function echoLocations() {
    $locations = objectToArray(json_decode($GLOBALS['row_Users']['user_locations']));

    foreach ($locations as $key => $value) {
        if($value["type"] == "github") { $icon = "icon-github"; }
        elseif($value["type"] == "ftp") { $icon = "icon-drawer-2"; }
        elseif($value["type"] == "sftp") { $icon = "icon-locked"; }
        else { $icon = "icon-storage"; }
    ?>
        <li id="<?php echo $key; ?>"><span class="icon <?php echo $icon; ?>"></span><?php echo $value["name"]; ?></li>
    <?php }
}
?>