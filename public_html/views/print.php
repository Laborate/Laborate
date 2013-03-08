<?php
//Requires & Config
require('server/php/user/restrict.php');
require("server/php/core/config.php");
require("server/php/template/dependencies.php");
require_once("includes/signature.php");
if(isset($_GET['i'])) { getDependencies(["print"]); }
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title><?php echo $_GET['t'].$_SESSION['webSiteTitle']; ?></title>
    <script type="text/javascript">
        <?php if(!isset($_GET['i'])) { ?>
            window.close();
        <?php } ?>
        history.replaceState({}, ("Codelaborate"),  "print");
    </script>
    <style type="text/css">
        #loading {
            position: absolute;
            width: 100%;
            height: 500px;
            color: #000;
            background: #fff;
            top: 0px;
            left: 0px;
            text-align: center;
            padding-top: 250px;
            font-family: 'Not Just Groovy';
            font-size: 36px;
            z-index: 100000;
        }
    </style>
    <?php placeDependencies(); ?>
</head>
<body>
    <!-- Visible Elements -->
    <div id="loading">Loading...</div>
    <div id="logo">code-laborate</div>
    <div id="title"><?php echo $_GET['t']; ?></div>
    <div id="date"><?php  $today = getdate(); echo $today['mon']."/".$today['mday']."/".$today['year']; ?></div>

    <!-- CodeMirror Elements -->
    <textarea id="code" name="code" runnable="true" style="display:none"></textarea>

    <!-- Data Elements -->
    <div id="mode" style="display:none"><?php echo explode(".", $_GET['t'])[1]; ?></div>
    <div id="session_id" style="display:none"><?php echo $_GET['i']; ?></div>
    <div id="password" style="display:none"><?php echo $_GET['p']; ?></div>
</body>
</html>