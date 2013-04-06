<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/vendor/PHPMailer/class.phpmailer.php');
include($_SERVER['DOCUMENT_ROOT'].'/class.smtp.php');

$addresses = array_unique(explode(",", $_POST['email_addresses']));
if(isset($_POST['session_id']) && count($addresses) <= 20) {
    $mail = new PHPMailer(true);
    $mail->IsSMTP();

    try {
        $mail->SMTPAuth   = $_SESSION['email_authentication'];
        $mail->SMTPSecure = $_SESSION['email_authentication_method'];
        $mail->Host       = $_SESSION['email_host'];
        $mail->Port       = $_SESSION['email_port'];
        $mail->Username   = $_SESSION['email_username'];
        $mail->Password   = $_SESSION['email_password'];

        foreach($addresses as $key => $email) {
            $mail->AddAddress(trim($email));
        }

        $post = $_POST;
        $post['url_host'] = $_SERVER["HTTP_HOST"];
        $mail->SetFrom($GLOBALS['row_Users']['user_email'], $GLOBALS['row_Users']['user_name']);
        $mail->AddReplyTo($GLOBALS['row_Users']['user_email'], $GLOBALS['row_Users']['user_name']);
        $mail->Subject = $_POST['session_name']." (".$GLOBALS['row_Users']['user_email'].") - ".substr($_SESSION['webSiteTitle'], 3);
        $mail->MsgHTML(file_get_contents("http://localhost/php/email/templates/invite.php?".http_build_query($post)));
        $mail->Send();
        echo 1;
    }
    catch (phpmailerException $e) {}
    catch (Exception $e) {}
}
?>
