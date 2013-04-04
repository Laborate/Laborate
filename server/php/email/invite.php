<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/vendor/PHPMailer/class.phpmailer.php');
include($_SERVER['DOCUMENT_ROOT'].'/class.smtp.php');

if(isset($_POST['session_id'])) {
    $mail = new PHPMailer(true);
    $mail->IsSMTP();

    //try {
        $mail->SMTPAuth   = true;
        $mail->SMTPSecure = "tls";
        $mail->Host       = "smtp.gmail.com";
        $mail->Port       = 587;
        $mail->Username   = "support@laborate.io";
        $mail->Password   = "vallelunga";

        foreach(explode(",", $_POST['email_addresses']) as $key => $email) {
            $mail->AddAddress(trim($email));
        }

        $mail->SetFrom($GLOBALS['row_Users']['user_email'], $GLOBALS['row_Users']['user_name']);
        $mail->Subject = $_POST['session_name']." (".$GLOBALS['row_Users']['user_email'].") - ".substr($_SESSION['webSiteTitle'], 3);

        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-type: application/x-www-form-urlencoded',
                'content' => $_POST
            )
        );

        $context  = stream_context_create($opts);
        $mail->MsgHTML(file_get_contents("http://".$_SERVER["HTTP_HOST"]."/php/email/templates/invite.php", false, $context));
        $mail->Send();
        echo 1;
    //}
    //catch (phpmailerException $e) {}
    //catch (Exception $e) {}
}
?>
