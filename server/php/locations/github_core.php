<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/vendor/autoload.php');

function startGithubClient() {
    if(!isset($client) || is_null($client)) {
        $client = new Github\Client();
        $client->authenticate($_SESSION['userGithub'], "", "http_token");
        $client->getHttpClient()->setOption('Authorization: token '.$_SESSION['userGithub']);
    }
    return $client;
}

function getRepositories() {
    $client = startGithubClient();
    $repos = array();
    $users = $client->api('current_user')->watched();
    foreach ($users as $key => $value) {
        array_push($repos, str_replace("https://api.github.com/repos/", "", $value['url']));
    }
    return $repos;
}

function getDirectory($repo, $dir="") {
    $url = "https://api.github.com/repos/".$repo."/contents/".$dir;
    $fields = array("access_token" => $_SESSION['userGithub']);
    $directory = array();
    if($dir) {
        array_push($directory, array("type"=> "back", "name" => "", "path" => substr($dir, 0, strrpos($dir, '/'))));
    }
    foreach(jsonToArray(curlGet($url, $fields)) as $key => $value) {
        array_push($directory, array("type"=> $value['type'], "name" => $value['name'], "path" => $value['path']));
    }
    return json_encode($directory);
}

function getFile($repo, $path) {
    $url = "https://api.github.com/repos/".$repo."/contents/".$path;
    $fields = array("access_token" => $_SESSION['userGithub']);
    $response = jsonToArray(curlGet($url, $fields));
    $file = $response['content'];
    return base64_decode($file);
}
?>