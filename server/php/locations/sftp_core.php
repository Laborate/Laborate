<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
set_include_path($_SERVER['DOCUMENT_ROOT'].'/server/php/vendor/phpseclib/');
include('Net/SFTP.php');

function getSftpClient($credentials) {
    $sftp = new Net_SFTP($credentials['host']);

    if(isset($credentials['key_file'])) {
        include('Crypt/RSA.php');
        $key = new Crypt_RSA();

        if(isset($credentials['password'])) {
            $key->setPassword($credentials['password']);
        }

        $key->loadKey($credentials['key_file']);
        if (!$sftp->login($credentials['username'], $credentials['key_file'])) {
            exit('RSA Login Failed');
        }
    } else {
        if (!$sftp->login($credentials['username'], $credentials['password'])) {
            exit('Login Failed');
        }
    }

    return $sftp;
}

function getDirectory($credentials, $dir="") {
    $sftp = getSftpClient($credentials);
    $sftp->chdir('..');
    $sftp->chdir($dir);
    return json_encode($sftp->nlist());
}

function getFile($credentials, $path) {
    $sftp = getSftpClient($credentials);
    $sftp->chdir('..');
    return $sftp->get($path);
}

function pushFile($credentials, $path, $file_contents) {
    $sftp = getSftpClient($credentials);
    $sftp->chdir('..');
    $sftp->put($path, $file_contents);
    return "File Pushed";
}

function deleteContent($credentials, $path) {
    $sftp = getSftpClient($credentials);
    $sftp->chdir('..');
    $sftp->delete($path, true);
    return "Content Deleted";
}

function renameContent($credentials, $old_path, $new_path) {
    $sftp = getSftpClient($credentials);
    $sftp->chdir('..');
    $sftp->rename($old_path, $new_path);
    return "Content Renamed";
}

?>