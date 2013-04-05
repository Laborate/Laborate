<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/vendor/PHPMailer/class.phpmailer.php');
include($_SERVER['DOCUMENT_ROOT'].'/class.smtp.php');

if(isset($_POST['session_id'])) {
    $mail = new PHPMailer(true);
    $mail->IsSMTP();

    try {
        $mail->SMTPAuth   = true;
        $mail->SMTPSecure = "tls";
        $mail->Host       = "smtp.gmail.com";
        $mail->Port       = 587;
        $mail->Username   = "support@laborate.io";
        $mail->Password   = "vallelunga";

        foreach(explode(",", $_POST['email_addresses']) as $key => $email) {
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
