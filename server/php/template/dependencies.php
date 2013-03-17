<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');

function getDependencies($dependencies) {
    if(in_array("core", $dependencies)) {
        array_push($GLOBALS['js'],  "core/center.js", "core/core.js", "core/cookie.js", "core/colors.js", "core/notification.js");
        array_push($GLOBALS['css'], "core/core.css", "core/form.css", "core/colors.css", "core/notification.css");
    }

    if(in_array("editor", $dependencies)) {
        array_push($GLOBALS['js'],  "editor/editorInit.js", "editor/editor.js", "editor/editorUtil.js", "editor/sidebar.js");
        array_push($GLOBALS['css'], "editor/editor.css", "editor/sidebar.css");
        array_push($GLOBALS['codeMirror_js'], "lib/codemirror.js", "addon/search/match-highlighter.js",
                                              "addon/format/formatting.js", "addon/search/search.js",
                                              "addon/search/searchcursor.js", "addon/edit/matchbrackets.js",
                                              "addon/selection/active-line.js", "addon/edit/closebrackets.js",
                                              "addon/edit/closetag.js");

        getDependencies(["icons", "codeMirror"]);
    }

    if(in_array("header", $dependencies)) {
        array_push($GLOBALS['css'], "core/header.css");
        array_push($GLOBALS['js'], "core/header.js");
    }

    if(in_array("chatroom", $dependencies)) {
        array_push($GLOBALS['js'], "editor/chatRoom.js");
        array_push($GLOBALS['css'], "editor/chatRoom.css");
        getDependencies(["jScroll"]);
    }

    if(in_array("jScroll", $dependencies)) {
        array_push($GLOBALS['js'],  "core/jscrollpane.js", "core/mousewheel.js");
        array_push($GLOBALS['css'], "core/jscrollpane.css");
    }

    if(in_array("print", $dependencies)) {
        array_push($GLOBALS['js'],  "editor/print.js");
        array_push($GLOBALS['css'], "editor/print.css");
        getDependencies(["codeMirror"]);
    }

    if(in_array("codeMirror", $dependencies)) {
        array_push($GLOBALS['codeMirror_js'], "lib/codemirror.js", "addon/mode/loadmode.js");
        array_push($GLOBALS['codeMirror_css'], "lib/codemirror.css", "theme/codelaborate.css");
    }

    if(in_array("backdrop", $dependencies)) {
        array_push($GLOBALS['js'], "backdrop/backdrop.js", "core/cookie.js", "core/center.js", "core/core.js");
        array_push($GLOBALS['css'], "backdrop/backdrop.css");

        if($GLOBALS['backdropMode'] == "editor") {
            array_push($GLOBALS['js'], "backdrop/backdropEditor.js", "backdrop/upload_file.js", "core/form.js");
        }

        if($GLOBALS['backdropMode'] == "login" || $GLOBALS['backdropMode'] == "register") {
            array_push($GLOBALS['js'], "backdrop/backdropUser.js");
        }
    }

    if(in_array("icons", $dependencies)) {
        array_push($GLOBALS['css'], "core/icons.css");
    }

    if(in_array("documents", $dependencies)) {
        array_push($GLOBALS['css'], "documents/documents.css");
        array_push($GLOBALS['js'], "documents/documents.js", "documents/documentsInit.js", "documents/documentsUtil.js");
    }

    if(in_array("account", $dependencies)) {
        array_push($GLOBALS['css'], "account/account.css");
        array_push($GLOBALS['js'], "account/account.js", "account/accountInit.js", "account/accountUtil.js");
    }
}

function placeDependencies() {

    if($_SESSION['no_cache'] == true) { $cache = '&nc='.rand(0, 1000000000); }
    else { $cache = ""; }

    if($GLOBALS['css']) {
        printf('<link href="http://resources.'.$_SERVER["HTTP_HOST"].'/min/?b=css&amp;f='.implode(",", array_unique($GLOBALS['css'])).$cache.'" rel="stylesheet" type="text/css">%1$s', PHP_EOL);
    }

    if($GLOBALS['codeMirror_css']) {
        printf('<link href="http://resources.'.$_SERVER["HTTP_HOST"].'/min/?b=codemirror&amp;f='.implode(",", array_unique($GLOBALS['codeMirror_css'])).$cache.'" rel="stylesheet" type="text/css">%1$s', PHP_EOL);
    }

    if($GLOBALS['js'] || $GLOBALS['codeMirror_js']) {
        printf('<script src="http://resources.'.$_SERVER["HTTP_HOST"].'/js/core/jquery.js" type="text/javascript"></script>%1$s', PHP_EOL);
    }

    if($GLOBALS['js']) {
        printf('<script src="http://resources.'.$_SERVER["HTTP_HOST"].'/min/?b=js&amp;f='.implode(",", array_unique($GLOBALS['js'])).$cache.'" type="text/javascript"></script>%1$s', PHP_EOL);
    }

    if($GLOBALS['codeMirror_js']) {
        printf('<script src="http://resources.'.$_SERVER["HTTP_HOST"].'/min/?b=codemirror&amp;f='.implode(",", array_unique($GLOBALS['codeMirror_js'])).$cache.'" type="text/javascript"></script>%1$s', PHP_EOL);
    }
}

$GLOBALS['js'] = array();
$GLOBALS['css'] = array();
$GLOBALS['codeMirror_js'] = array();
$GLOBALS['codeMirror_css'] = array();
?>