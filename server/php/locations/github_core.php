<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/vendor/autoload.php');

function startGithubClient() {
    $client = new Github\Client(new Github\HttpClient\CachedHttpClient(array('cache_dir' => '/tmp/github-api-cache')));
    $client->authenticate($_SESSION['userGithub'], "", "http_token");
    $client->getHttpClient()->setOption('auth_method', "AUTH_HTTP_TOKEN");
    $client->getHttpClient()->setOption('secret', $_SESSION['userGithub']);
    return $client;
}

function getRepositories() {
    try {
        $client = startGithubClient();
        $repos = array();
        $response = $client->getHttpClient()->get("user/subscriptions")->getContent();
        foreach ($response as $key => $value) {
            array_push($repos, str_replace("https://api.github.com/repos/", "", $value['url']));
        }
    } catch(Github\Exception\RuntimeException $e) {
        $repos = 'Bad Token';
    }

    return json_encode($repos);
}

function getDirectory($repo, $dir="") {
    try {
        $client = startGithubClient();
        $response = $client->getHttpClient()->get("repos/".$repo."/contents/".$dir)->getContent();
        $directory = array();
        if($dir) {
            array_push($directory, array("type"=> "back", "name" => "", "path" => substr($dir, 0, strrpos($dir, '/'))));
        }
        foreach($response as $key => $value) {
            array_push($directory, array("type"=> $value['type'], "name" => $value['name'], "path" => $value['path']));
        }
        $json = json_encode($directory);
    } catch(Github\Exception\RuntimeException $e) {
        $json = 'Bad Token';
    }

    return $json;
}

function getFile($repo, $path) {
    try {
        $client = startGithubClient();
        $response = $client->getHttpClient()->get("repos/".$repo."/contents/".$path)->getContent();
        $file = $response['content'];
        $decoded_file = base64_decode($file);
    } catch(Github\Exception\RuntimeException $e) {
        $decoded_file = 'Bad Token';
    }
    return $decoded_file;
}
?>