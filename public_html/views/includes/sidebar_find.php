<div id="sidebar_find" class="sidebar_content_inner">
    <script type="text/javascript">
        $("#lineNumberList .listX").live("click", function() { window.sidebarUtil.highlightRemove($(this).parent()); });
        $("#findList .listX").live("click", function() { window.sidebarUtil.searchRemove($(this)); });
        $("#lineNumberJumpForm").on("submit", function() { window.sidebarUtil.jumpToLine($("#lineNumberJump").val()); $("#lineNumberJump").val(""); });
        $("#lineNumberForm").on("submit", function() { window.sidebarUtil.highlight($("#lineNumber").val()); $("#lineNumber").val(""); });
        $("#findWordsForm").on("submit", function() { window.sidebarUtil.search($("#findWords").val()); $("#findWords").val(""); });
    </script>
	<div>
        <div class="header">Jump To A Line</div>
        <form id="lineNumberJumpForm">
            <input id="lineNumberJump" class="left input" style="width:120px;" type="text" placeholder="5" spellcheck="false"/>
            <input type="submit" class="button blue right" id="lineNumberJumpGo" value="Jump">
            <div class="clear"></div>
        </form>
     </div>
     <hr/>
     <div>
        <div class="header">Line Number (s)</div>
        <form id="lineNumberForm">
            <input id="lineNumber" class="left input" style="width:120px;" type="text" placeholder="1, 15-40, 55" spellcheck="false"/>
            <input type="submit" class="button blue right" id="lineNumberGo" value="Find">
            <div class="clear"></div>
        </form>
        <div id="lineNumberList" style="margin-top:15px;"></div>
    </div>
    <hr/>
    <div>
        <div class="header">Find Words</div>
        <form id="findWordsForm">
            <input id="findWords" type="text"  class="left input" style="width:120px;"  placeholder="function()" spellcheck="false"/>
            <input type="submit" class="button blue right" id="findWordsGo" value="Find">
            <div class="clear"></div>
        </form>
        <div id="findList" style="margin-top:15px;"></div>
    </div>
</div>