<div id="sidebar_document" class="sidebar_content_inner">
    <script type="text/javascript">
        $("#document_undo").on("click", function() { window.editor.undo(); });
        $("#document_redo").on("click", function() { window.editor.redo(); });
        $("#document_format_selection").on("click", function() { window.editor.format(); });
        $("#document_format").on("click", function() { window.editor.format(true); });
    </script>
    <a href="/editor/" class="button green full" style="display:block">New Document</a>
    <hr/>
    <div>
        <div class="header">Document History</div>
        <input id="document_undo" type="button" value="Undo" class="button blue pull_left"/>
        <input id="document_redo" type="button" value="Redo" class="button blue pull_right"/>
        <div class="clear"></div>
    </div>
    <hr/>
    <div>
        <div class="header">Auto Format</div>
        <input id="document_format_selection" type="button" value="Selection" class="button blue pull_left"/>
        <input id="document_format" type="button" value="All" class="button blue pull_right"/>
        <div class="clear"></div>
    </div>
</div>