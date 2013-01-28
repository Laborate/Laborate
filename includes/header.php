<div id="header">
    <a href="../editor" id="logo">code-laborate</a>
    <div id="document_info">
            <?php if($GLOBALS['backdropMode'] == "editor") {
                $class = 'class="'."hover".'"';
                $onclick = 'onclick="'."sidebar('settings', 'documentTitle');".'"';
            } ?>
            <div id="document_title" <?php echo $class." ".$onclick; ?>><?php echo $title; ?></div>
        <div id="document_contributors"></div>
        <div id="contributor_info">
            <div id="contributor_info_arrow"></div>
            <div id="contributor_info_name"></div>
        </div>
    </div>
    <div id="user">
        <div><a href="server/php/user/logout">Sign Out</a></div>
        <div><a href="documents">Documents</a></div>
        <div><a href="account"><?php echo $_SESSION['userName']; ?></a></div>
    </div>
    <div class="clear"></div>
</div>
<div id="tshadow"></div>