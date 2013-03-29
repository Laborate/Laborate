<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_POST['session_id'])) {
    $to  = 'To: '.$_POST['email_addresses'];
    $subject = $_SESSION['userName']." Has Invited You To Work On ".$_POST['session_name'].$_SESSION['webSiteTitle'];
    ob_start();
        $file_name = $_POST['session_name'];
        $additional_message = $_POST['email_message'];
        include($_SERVER['DOCUMENT_ROOT']."/php/templates/invite.php");
        $message = ob_get_contents();
    ob_end_clean();
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'From: '.$GLOBALS['row_Users']['user_name'].' <'.$GLOBALS['row_Users']['user_email'].'>' . "\r\n";
    mail($to, $subject, $message, $headers);
    echo 1;
}
?>
