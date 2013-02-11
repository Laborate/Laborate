<?php
$GLOBALS['ajax_message'] = "";
$GLOBALS['ajax_only'] = true;
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/locations/github_core.php');

$call = getRepositories();
$response = jsonToArray($call);
if(gettype($response) == "array") {
    $repos = array();
    foreach ($response as $key => $value) {
        $repo_name = explode("/", $value['repo']);
        array_push($repos, array("user" => $repo_name[0], "repo" => $repo_name[1], "private" => $value['private']));
    }
    echo json_encode($repos);
}
else {
    echo $call;
}
?>