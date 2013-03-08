<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
getDependencies(["core", "backdrop"]);
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Codelaborate - Servers Down</title>
    <?php placeDependencies(); ?>
</head>
<body>
    <div id="backdrop">
        <div id="backdropCore">
            <a href="http://codelaborate:8888"><div id="backDropLogo">code-laborate</div></a>
            <!-- Start: Backdrop Error -->
            <div id="backdropInital">
                <div class="backdropContainer">
                    <div class="seperatorRequired" style="text-align: center;">
                        <img src="/img/error_big.png" width="100px" height="125px"/>
                    </div>
                    <div class="backdropInitalWelcome" style="font-size: 16px;">
                        Sorry, our website is currently<br/>down. Please check back later.
                    </div>
                </div>
            </div>
            <!-- End: Backdrop Error -->
        </div>
    </div>
</body>
</html>