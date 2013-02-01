<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/vendor/autoload.php');

function startGithubClient() {
    //if(!isset($client) || is_null($client)) {
        $client = new Github\Client(new Github\HttpClient\CachedHttpClient(array('cache_dir' => '/tmp/github-api-cache')));
        $client->authenticate($_SESSION['userGithub'], "", "http_token");
        $client->getHttpClient()->setOption('auth_method', "AUTH_HTTP_TOKEN");
        $client->getHttpClient()->setOption('secret', $_SESSION['userGithub']);
    //}
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
    $client = startGithubClient();
    $response = $client->getHttpClient()->get("repos/".$repo."/contents/".$dir)->getContent();
    $directory = array();
    if($dir) {
        array_push($directory, array("type"=> "back", "name" => "", "path" => substr($dir, 0, strrpos($dir, '/'))));
    }
    foreach($response as $key => $value) {
        array_push($directory, array("type"=> $value['type'], "name" => $value['name'], "path" => $value['path']));
    }
    echo $url;
    return json_encode($directory);
}

function getFile($repo, $path) {
    $client = startGithubClient();
    $response = $client->getHttpClient()->get("repos/".$repo."/contents/".$path)->getContent();
    $file = $response['content'];
    return base64_decode($file);
}
?>