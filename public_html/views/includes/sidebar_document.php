<div id="sidebar_document" class="sidebar_content_inner">
    <a href="/editor/" class="button green full" style="display:block">New Document</a>
    <hr/>
    <div>
        <div class="header">Document History</div>
        <input type="button" value="Undo" onclick="window.editor.undo();" class="button blue pull_left"/>
        <input type="button" value="Redo" onclick="window.editor.redo();" class="button blue pull_right"/>
        <div class="clear"></div>
    </div>
    <hr/>
    <div>
        <div class="header">Auto Format</div>
        <input type="button" value="Selection" onclick="window.editorUtil.format();" class="button blue pull_left"/>
        <input type="button" value="All" onclick="window.editorUtil.format(true);" class="button blue pull_right"/>
        <div class="clear"></div>
    </div>
</div>