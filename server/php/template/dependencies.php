<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');

function getDependencies($dependencies) {
    if(in_array("core", $dependencies)) {
        array_push($GLOBALS['js'],  "center.js", "core.js", "cookie.js", "colors.js");
        array_push($GLOBALS['css'], "core.css", "form.css", "colors.css");
    }

    if(in_array("editor", $dependencies)) {
        array_push($GLOBALS['js'],  "editorInit.js", "editor.js", "editorUtil.js", "sidebar.js", "users.js", "colors.js");
        array_push($GLOBALS['css'], "editor.css", "sidebar.css");
        array_push($GLOBALS['codeMirror_js'], "codemirror.js", "util/match-highlighter.js", "util/loadmode.js");
        array_push($GLOBALS['codeMirror_js'], "util/formatting.js", "util/search.js", "util/searchcursor.js");
        array_push($GLOBALS['codeMirror_css'], "codemirror.css", "codelaborate.css");
        getDependencies(["icons"]);
    }

    if(in_array("header", $dependencies)) {
        array_push($GLOBALS['css'], "header.css");
        array_push($GLOBALS['js'], "header.js");
    }

    if(in_array("chatroom", $dependencies)) {
        array_push($GLOBALS['js'], "chatRoom.js");
        array_push($GLOBALS['css'], "chatRoom.css");
        getDependencies(["jScroll"]);
    }

    if(in_array("jScroll", $dependencies)) {
        array_push($GLOBALS['js'],  "jscrollpane.js", "mousewheel.js");
        array_push($GLOBALS['css'], "jscrollpane.css");
    }

    if(in_array("print", $dependencies)) {
        array_push($GLOBALS['js'],  "print.js");
        array_push($GLOBALS['css'], "print.css");
        getDependencies(["codeMirror"]);
    }

    if(in_array("codeMirror", $dependencies)) {
        array_push($GLOBALS['codeMirror_js'], "codemirror.js", "util/loadmode.js");
        array_push($GLOBALS['codeMirror_css'], "codemirror.css", "codelaborate.css");
    }

    if(in_array("backdrop", $dependencies)) {
        array_push($GLOBALS['js'], "backdrop.js", "cookie.js", "center.js", "core.js");
        array_push($GLOBALS['css'], "backdrop.css");

        if($GLOBALS['backdropMode'] == "editor") {
            array_push($GLOBALS['js'], "upload_file.js", "form.js");
        }

        if($GLOBALS['backdropMode'] == "login" || $GLOBALS['backdropMode'] == "register") {
            array_push($GLOBALS['js'], "backdropUser.js");
        }
    }

    if(in_array("icons", $dependencies)) {
        array_push($GLOBALS['css'], "icons.css");
    }

    if(in_array("documents", $dependencies)) {
        array_push($GLOBALS['css'], "documents.css");
        array_push($GLOBALS['js'], "documents.js", "documentsInit.js");
    }
}

function placeDependencies() {

    if($_SESSION['cache'] == true) { $cache = '&nc='.rand(0, 1000000000); }
    else { $cache = ""; }

    echo ('<!-- Opera Speed Dial Favicon -->
    <link rel="icon" type="image/png" href="/favicon/160.png" />
    <!-- Standard Favicon -->
    <link rel="icon" type="image/png" href="/favicon/16.png" />
    <!-- For iPhone 4 Retina display: -->
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/favicon/114.png">
    <!-- For iPad: -->
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/favicon/72.png">
    <!-- For iPhone: -->
    <link rel="apple-touch-icon-precomposed" href="/favicon/57.png">');

    if($GLOBALS['css']) {
        echo '<link href="/min/?b=css&amp;f='.implode(",", array_unique($GLOBALS['css'])).$cache.'" rel="stylesheet" type="text/css"/>';
    }

    if($GLOBALS['codeMirror_css']) {
        echo '<link href="/min/?b=lib&amp;f='.implode(",", array_unique($GLOBALS['codeMirror_css'])).$cache.'" rel="stylesheet" type="text/css"/>';
    }

    if($GLOBALS['js'] || $GLOBALS['codeMirror_js']) {
        echo '<script src="/js/jquery.js" type="text/javascript"></script>';
    }

    if($GLOBALS['js']) {
        echo '<script src="/min/?b=js&amp;f='.implode(",", array_unique($GLOBALS['js'])).$cache.'" type="text/javascript"></script>';
    }

    if($GLOBALS['codeMirror_js']) {
        echo '<script src="/min/?b=lib&amp;f='.implode(",", array_unique($GLOBALS['codeMirror_js'])).$cache.'" type="text/javascript"></script>';
    }
}

$GLOBALS['js'] = array();
$GLOBALS['css'] = array();
$GLOBALS['codeMirror_js'] = array();
$GLOBALS['codeMirror_css'] = array();
?>