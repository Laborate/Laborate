<?php
$backdrop_logo = "font-size: 18px; text-align:center; text-decoration:none; color: #000000;";
$backdrop_container = "-moz-border-radius: 5px; border-radius: 5px; border: 1px solid #CCCCCC; overflow:hidden;";
$backdrop_info = "font-size: 18px; color: #516067; word-break: break-all; word-wrap: break-word; border-bottom:1px solid #E4E4E4;";
$backdrop_info_small = "font-size: 14px; font-style:italic; color: #516067; word-break: break-all; word-wrap: break-word; border-bottom:1px solid #CCCCCC; ";
$backdrop_info_password = "font-size: 14px; color: #516067; border-bottom:1px solid #CCCCCC; ";
$backdrop_additional = "border-bottom:1px solid #999999; background: #f2f2f2";
$backdrop_button = "font-size: 14px; cursor: pointer; padding: 3px 10px; -moz-border-radius: 3px; border-radius: 3px; font-weight: bold; text-align: center; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; text-decoration: none; color: #ffffff; border: solid 1px #0d92ff; background: #2EA2FF; display:block;";
?>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body leftmargin="0" margin="0" topmargin="0" marginheight="0" offset="0">
    <table width="100%" bgcolor="#FFFFFF" cellpadding="10" cellspacing="0">
        <tr valign="middle" align="center">
            <td>
                <table width="300" bgcolor="#FFFFFF" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                            <a style="<?php echo $backdrop_logo; ?>" href="<?php echo "http://".$_GET['url_host']."/"; ?>" target="_blank">
                                <img src="http://resources.code.dev.laborate.io/img/email_logo.png" border="0" width="300px" height="30px">
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="300" bgcolor="#F8F8F8" cellpadding="15" cellspacing="0" style="<?php echo $backdrop_container; ?>">
                                <tr>
                                    <td bgcolor="#F8F8F8" align="center" style="<?php echo $backdrop_info; ?>">
                                        <?php echo $_GET['session_name']; ?>
                                    </td>
                                </tr>
                                <?php if($_GET['email_message'] != "") { ?>
                                    <tr>
                                        <td bgcolor="#f2f2f2" align="center" style="<?php echo $backdrop_info_small; ?>">
                                            <?php echo $_GET['email_message']; ?>
                                        </td>
                                    </tr>
                                <?php } ?>
                                <tr>
                                    <td bgcolor="#F8F8F8" style="padding: 15px;">
                                        <a href="<?php echo "http://".$_GET['url_host']."/editor/?i=".$_GET['session_id']; ?>" style="<?php echo $backdrop_button; ?>" target="_blank">Start Coding</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>