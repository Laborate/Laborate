<div id="backdrop">
    <div id="backdropCore">
            <a href="http://<?php echo $_SERVER["HTTP_HOST"]; ?>/"><div id="backDropLogo">code-laborate</div></a>
            <?php if($GLOBALS['backdropMode'] == "editor") { ?>
                <div id="userNavigation">
                    <div><a href="/php/user/logout/">Sign Out</a></div>
                    <div>|</div>
                    <div><a href="/documents/">Documents</a></div>
                    <div>|</div>
                    <div><a href="/account/" id="userNavigationName"><?php echo $_SESSION['userName']; ?></a></div>
                </div>
                <?php if(!isset($_GET['i'])) { ?>
                <!-- Start: Backdrop New File -->
                <div id="backdropNewFile">
                    <form id="backdropNewFileForm" class="backdropContainer">
                        <div id="initialForm">
                            <div class="backdropInitalWelcome seperatorRequired">Upload or Create<br/>A New Code Document</div>
                            <div id="backdropDataInput">
                                <input type="text" id="backdropScreenName" placeholder="Screen Name" style="margin-bottom: 10px;"/>
                                <div style="position: relative">
                                    <input type="text" autofocus="on" class="left" id="backdropDocTitle" placeholder="File Name"/>
                                    <div id="backdropUpload" class="left">Upload</div>
                                </div>
                                <div class="clear"></div>
                                <input type="submit" class="backdropButton button full blue" id="backdropGo" value="Start Coding" />
                            </div>
                        </div>
                        <div id="upload_section">
                            <div class="backdropInitalWelcome seperatorRequired"></div>
                            <div id="upload_slider_box">
                                <div id="upload_slider" class="blue" style="border:none !important;"></div>
                                <div id="upload_text"></div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div style="text-align: center;" id="backdropLoaderImg"><img src="http://resources.<?php echo $_SERVER["HTTP_HOST"]; ?>/img/loader.gif" width="220" height="19"/></div>
                        <div class="clear"></div>
                    </form>
                    <form action="/php/template/upload.php" method="post" enctype="multipart/form-data" id="file_upload">
                        <input type="file" id="backdropUploadFile" name="backdropUploadFile" style="display:none"/>
                    </form>
                    <div class="textError" style="margin-top: 10px; text-align: center; color:#CC352D;">File Name Requires An Extension</div>
                </div>
                <!-- End: Backdrop New File -->
            <?php } else { ?>
                <!-- Start: Backdrop Existing File -->
                <div id="backdropExistingFile">
                    <form id="backdropExistingFileForm" class="backdropContainer">
                        <div class="backdropInitalWelcome seperatorRequired"><?php echo $initalize[1]; ?></div>
                        <div id="backdropDataInput">
                            <input type="hidden" id="backdropDocTitle" value="<?php echo $initalize[1] ?>"/>
                            <?php if($initalize[0] == true) { ?>
                                <input type="text" autofocus="on" id="backdropScreenName" placeholder="Screen Name" style="margin-bottom: 10px;"/>
                                <input type="password" id="backdropPassword" placeholder="Password"/>
                            <?php } else { ?>
                                <input type="text" autofocus="on" id="backdropScreenName" placeholder="Screen Name"/>
                                <input type="hidden" id="backdropPassword" value=""/>
                            <?php } ?>
                            <input type="submit" class="backdropButton button full blue" id="backdropGo" value="Start Coding"/>
                        </div>
                        <div style="text-align: center;" id="backdropLoaderImg"><img src="http://resources.<?php echo $_SERVER["HTTP_HOST"]; ?>/img/loader.gif" width="220" height="19"/></div>
                    </form>
                    <div class="textError" style="margin-top: 10px; text-align: center; color:#CC352D;">Password Incorrect</div>
                </div>
                <!-- End: Backdrop Existing File -->
            <?php } ?>
        <?php } ?>
        <?php if($GLOBALS['backdropMode'] == "login") { ?>
            <!-- Start: Backdrop Login -->
            <div id="backdropInital">
                <div class="backdropContainer">
                    <div class="backdropInitalWelcome seperatorRequired">Collaborative software<br>development made easy!</div>
                    <div class="seperatorRequired">
                        <form id="backdropSigIn">
                            <input type="text" autofocus="on" id="backdropSigInEmail" placeholder="Email"/>
                            <input type="password" id="backdropSigInPassword" placeholder="Password"/>
                            <input type="submit" class="backdropButton button full blue" value="Sign In"/>
                        </form>
                    </div>
                    <div class="backdropInitalWelcome" style="font-size: 14px;">
                        Don't Have An Account? <a href="/register/">Register!</a>
                    </div>
                </div>
                <div class="textError" style="margin-top: 10px; text-align: center; color:#CC352D;"></div>
            </div>
            <!-- End: Backdrop Login -->
        <?php } ?>
        <?php if($GLOBALS['backdropMode'] == "register") { ?>
            <!-- Start: Backdrop Register -->
            <div id="backdropInital">
                <div class="backdropContainer">
                    <div class="backdropInitalWelcome seperatorRequired">Collaborative software<br>development made easy!</div>
                    <div class="seperatorRequired">
                        <form id="backdropRegister">
                            <input type="text" autofocus="on" id="backdropRegisterName" placeholder="Name"/>
                            <input type="text" id="backdropRegisterEmail" placeholder="Email"/>
                            <input type="password" id="backdropRegisterPassword" placeholder="Password"/>
                            <input type="password" id="backdropRegisterConfirm" placeholder="Confirm Password"/>
                            <input type="submit" class="backdropButton button full blue" value="Register"/>
                        </form>
                    </div>
                    <div class="backdropInitalWelcome" style="font-size: 14px;">
                       Have An Account? <a href="/login/">Sign In!</a>
                    </div>
                </div>
                <div class="textError" style="margin-top: 10px; text-align: center; color:#CC352D;"></div>
            </div>
            <!-- End: Backdrop Register -->
        <?php } ?>
    </div>
</div>