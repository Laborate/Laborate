<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
getDependencies(["core", "backdrop"]);
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Realtime Server Error<?php echo $_SESSION['webSiteTitle']; ?></title>
	<script src="http://<?php echo $_SERVER['SERVER_ADDR']; ?>:8000/socket.io/socket.io.js"></script>
    <script type="text/javascript">
        try {
  	        window.nodeSocket = io.connect('http://<?php echo $_SERVER['SERVER_ADDR']; ?>:8000');
  	        window.location.href = "/editor";
  	    } catch(err) {}
    </script>
    <?php placeDependencies(); ?>
</head>
<body>
    <div id="backdrop">
        <div id="backdropCore">
            <a href="http://code.<?php echo $_SESSION['box']; ?>laborate.io/"><div id="backDropLogo">code-laborate</div></a>
            <!-- Start: Backdrop Error -->
            <div id="backdropInital">
                <div class="backdropContainer">
                    <div class="seperatorRequired" style="text-align: center;">
                        <img src="http://resources.code.<?php echo $_SESSION['box']; ?>laborate.io/img/error_big.png" width="100px" height="125px"/>
                    </div>
                    <div class="backdropInitalWelcome" style="font-size: 16px;">
                        Sorry, our real-time servers are<br/>down. Please check back soon.
                    </div>
                </div>
            </div>
            <!-- End: Backdrop Error -->
        </div>
    </div>
</body>
</html>