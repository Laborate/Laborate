<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/vendor/autoload.php');

function startGithubClient() {
    //Regular Version
    $client = new Github\Client();
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
            array_push($repos, array("repo" => str_replace("https://api.github.com/repos/", "", $value['url']), "private" => $value['private']));
        }
        $repos = $repos;
    } catch(Github\Exception\RuntimeException $e) {
        $repos = 'Bad Token';

    } catch(Github\Exception\InvalidArgumentException $e) {
        $repos = 'Login Required';
    }

    return $repos;
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
        $json = $directory;
    } catch(Exception $e) {
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
    } catch(Exception $e) {
        $decoded_file = 'Bad Token';
    }

    return $decoded_file;
}

function getCommit($repo, $path, $file, $message) {
    try {
        $client = startGithubClient();
        $sha_latest = $client->getHttpClient()->get("repos/".$repo."/branches")->getContent()[0]['commit']['sha'];
        $tree_base = $client->getHttpClient()->get("repos/".$repo."/git/commits/".$sha_latest)->getContent()['tree']['sha'];
        $sha_new_parameters = array("base_tree" => $tree_base,"tree" => array(array("path" => $path, "content" => $file)));
        $sha_new = $client->getHttpClient()->post("repos/".$repo."/git/trees/", $sha_new_parameters)->getContent()['sha'];
        $sha_commit_parameters = array("message" => $message, "parents" => array($sha_latest), "tree" => $sha_new);
        $sha_commit = $client->getHttpClient()->post("repos/".$repo."/git/commits/", $sha_commit_parameters)->getContent()['sha'];
        $master_parameters = array("sha" => $sha_commit, "force" => true);
        $master = $client->getHttpClient()->post("repos/".$repo."/git/refs/heads/master/", $master_parameters)->getContent();
        $response_code = "Commit Succeeded";
    } catch(Exception $e) {
        $response_code = "Bad Token";
    }

    return $response_code;
}
?>