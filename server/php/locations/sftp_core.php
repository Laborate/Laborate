<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
set_include_path($_SERVER['DOCUMENT_ROOT'].'/server/php/vendor/phpseclib/');
include('Net/SFTP.php');

function getSftpClient($credentials) {
    $sftp = new Net_SFTP($credentials['sftp_server']);

    if(isset($credentials['sftp_key_file'])) {
        include('Crypt/RSA.php');
        $key = new Crypt_RSA();

        if(isset($credentials['sftp_user_password'])) {
            $key->setPassword($credentials['sftp_user_password']);
        }

        $key->loadKey($credentials['sftp_key_file']);
        if (!$sftp->login($credentials['sftp_user_name'], $key)) {
            exit('Bad Credentials');
        }
    } else {
        if(isset($credentials['sftp_user_password'])) {
            if (!$sftp->login($credentials['sftp_user_name'], $credentials['sftp_user_password'])) {
                exit('Bad Credentials');
            }
        } else {
           if (!$sftp->login()) {
                exit('Bad Credentials');
            }
        }
    }
    return $sftp;
}

function getDirectory($credentials, $dir="") {
    $directory = array();
    $sftp = getSftpClient($credentials);
    $sftp->chdir('..');

    if($dir != "") {
        $sftp->chdir($dir);
    } else {
        $dir = $credentials['sftp_server_default'];
        $sftp->chdir($credentials['sftp_server_default']);
    }

    if($dir != "" && $dir != "/") {
        $back_dir = substr($dir, 0, strrpos($dir, '/'));
        array_push($directory, array("type"=> "back", "name" => "", "path" => substr($back_dir, 0, strrpos($back_dir, '/'))."/"));
    }

    foreach($sftp->rawlist() as $key => $value) {
        if($key != "." && $key != "..") {
            if($value['type'] == "1") { $type = "file"; $path = $dir.$key; }
            else if($value['type'] == "2") { $type = "dir"; $path = $dir.$key."/"; }
            array_push($directory, array("type"=> $type, "name" => $key, "path" => $path));
        }
    }

    return json_encode($directory);
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