<div id="sidebar_find" class="sidebar_content_inner">
    <script type="text/javascript">
        $("#lineNumberList .listX").on("click", function() { window.editorUtil.highlightRemove($(this).parent()); });
        $("#findList .listX").on("click", function() { window.editorUtil.searchRemove($(this)); });
        $("#lineNumberScrollForm").on("submit", function() { window.editorUtil.scroll($("#lineNumberScroll").val()); $("#lineNumberScroll").val(""); });
        $("#lineNumberForm").on("submit", function() { window.editorUtil.highlight($("#lineNumber").val()); $("#lineNumber").val(""); });
        $("#findWordsForm").on("submit", function() { window.editorUtil.search($("#findWords").val()); $("#findWords").val(""); });
        $("#findRegexForm").on("submit", function() { alert("havent started yet") });
    </script>
	<div>
        <div class="header">Scroll To A Line</div>
        <form id="lineNumberScrollForm">
            <input id="lineNumberScroll" class="left input" style="width:120px;" type="text" placeholder="5" spellcheck="false"/>
            <input type="submit" class="button blue right" id="lineNumberScrollGo" value="Find">
            <div class="clear"></div>
        </form>
        <div id="lineNumberScrollList" style="margin-top:15px;"></div>
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
    <hr/>
    <div>
        <div class="header">Find Regex</div>
        <form id="findRegexForm">
            <input id="findRegex" type="text"  class="left input" style="width:120px;"  placeholder="\bt[a-z]+\b" spellcheck="false"/>
            <input type="submit" class="button blue right" id="findRegexGo" value="Find">
            <div class="clear"></div>
        </form>
        <div id="findRegexList" style="margin-top:15px;"></div>
    </div>
</div>