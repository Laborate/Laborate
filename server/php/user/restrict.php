<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(!function_exists('redirect')) {
    function redirect($logout) {
        if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' ) {
            echo $GLOBALS['ajax_message'];
        } else {
            if($GLOBALS['ajax_only']) {
                header('HTTP/1.0 404 Not Found');
                include($_SERVER['DOCUMENT_ROOT'].'/errors/notfound.php');
                exit();
            } else {
                require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
                require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

                if(isset($_COOKIE['userLogin'])) {
                    $query_Login = "SELECT * FROM users, login WHERE login.login_hash = '".$_COOKIE['userLogin']."' AND login.login_user_id = users.user_id";
                    $Login = mysql_query($query_Login , $database) or die(mysql_error());
                    $row_Login = mysql_fetch_assoc($Sessions);
                    echo $row_Sessions['login_hash']." - ".$_COOKIE['userLogin'];
                    if($row_Sessions['login_hash'] == $_COOKIE['userLogin']) {
                        if($row_Sessions['user_password'] == crypt($_POST['user_password'], $_SESSION['cryptSalt'])) {
                            $_SESSION['userId'] = $row_Login['user_id'];
                            $_SESSION['userName'] = $row_Login['user_name'];
                            $_SESSION['userEmail'] = $row_Login['user_email'];
                            $_SESSION['userLevel'] = $row_Login['user_level'];
                            if(!is_null($row_Login['user_github'])) {
                                $_SESSION['userGithub'] = aesDecrypt($row_Login['user_github'], $_SESSION['cryptSalt']);
                            } else {
                                $_SESSION['userGithub'] = $row_Login['user_github'];
                            }

                            $hash = md5($row_Login['user_id'] + $row_Login['user_email'] + rand(0, 1000000000000000000000000));
                            setcookie('userLogin', $hash, time()+1209600, "/");

                            $insertSQL = sprintf("INSERT INTO login ( login_hash, login_user_id ) VALUES (%s, %s)",
                            GetSQLValueString($hash, "text"), $row_Login['user_id']);
                            $Sessions = mysql_query($insertSQL , $database) or die(mysql_error());

                            $deleteSQL = sprintf("DELETE FROM login WHERE login.login_hash = '".$_COOKIE['userLogin']."'");
                            $delete = mysql_query($deleteSQL , $database) or die(mysql_error());
                            header("Location: /documents");
                        } else {
                            echo 1;
                            if($logout) {
                                //header("Location: /server/php/user/logout?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                            }
                            else {
                                //header("Location: /login?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                            }
                        }
                    } else {
                        echo 2;
                        if($logout) {
                            //header("Location: /server/php/user/logout?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                        }
                        else {
                            //header("Location: /login?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                        }
                    }
                } else {
                    echo 3;
                    if($logout) {
                        //header("Location: /server/php/user/logout?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                    }
                    else {
                        //header("Location: /login?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                    }
                }
            }
        }
    }
}

if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' && $GLOBALS['ajax_only']) {
    redirect();
}
else {
    if(isset($_SESSION['userId'])) {
        if($GLOBALS['row_Users']['user_id'] != $_SESSION['userId']) {
            redirect(true);
        }
    } else { redirect(false); }
}
?>