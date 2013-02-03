<?php
$GLOBALS['ajax_message'] = "";
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/locations/github_core.php');

$response = getRepositories();
if($response != "Bad Token") {
    $repos = array();
    foreach ($response as $key => $value) {
        $repo_name = explode("/", $value);
        array_push($repos, array("user" => $repo_name[0], "repo" => $repo_name[1]));
    }
    echo json_encode($repos);
}
else {
    echo "Bad Token";
}
?>