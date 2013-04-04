<?php

$backdrop_logo = "font-size: 18px; text-align:center; text-decoration:none; color: #000000;";
$backdrop_container = "-moz-border-radius: 5px; border-radius: 5px; border: 1px solid #cccccc;";
$backdrop_button = "font-size: 14px; cursor: pointer; padding: 3px 10px; -moz-border-radius: 3px; border-radius: 3px; font-weight: bold; text-align: center; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; text-decoration: none; color: #ffffff; border: solid 1px #0d92ff; background: #2EA2FF;";

?>

<!--
<html>
<body leftmargin="0" margin="0" topmargin="0" marginheight="0" offset="0">
    <div id="backdrop">
        <div style="width: 255px;">
            <div style="<?php echo $backdrop_logo; ?>">code-laborate</div>
            <div style="<?php echo $backdrop_container; ?>">
                <div class="backdropInitalWelcome seperatorRequired"><?php echo $_POST['session_name']; ?></div>
                <?php if(is_null($_POST['email_message'])) { ?>
                    <div id="addtional" class="seperatorRequired">
                        <div><?php echo $_POST['email_message']; ?></div>
                    </div>
                <?php } ?>
                <div style="<?php echo $backdrop_button; ?>">Start Codelaborating</div>
            </div>
        </div>
    </div>
</body>
</html>
-->

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta property="og:title" content="*|MC:SUBJECT|*" />
    <title>*|MC:SUBJECT|*</title>
</head>
<body leftmargin="0" margin="0" topmargin="0" marginheight="0" offset="0">
    <table width="100%" bgcolor="#FFFFFF" cellpadding="10" cellspacing="0">
        <tr valign="middle" align="center">
            <td>
                <table width="300" bgcolor="#FFFFFF" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                            <a style="<?php echo $backdrop_logo; ?>" href="http://<?php echo $_SERVER["HTTP_HOST"]; ?>" target="_blank">
                                code-laborate
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="300" bgcolor="#F8F8F8" cellpadding="15" cellspacing="0" style="<?php echo $backdrop_container; ?>">
                                <tr>
                                    <td align="center" style="border-bottom:1px solid #CCCCCC"><?php echo $_POST['session_name']; ?></td>
                                </tr>
                                <?php if(is_null($_POST['email_message'])) { ?>
                                    <td align="center" style="border-bottom:1px solid #CCCCCC"><?php echo $_POST['email_message']; ?></td>
                                </tr>
                                <?php } ?>
                                <tr>
                                    <td style="padding: 5px;"><div style="<?php echo $backdrop_button; ?>">Start Coding</div></td>
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