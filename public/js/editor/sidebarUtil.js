window.sidebarUtil = {
	change: function(module, permanent) {
	    var element = $(".sidebar .list .item[data-key='" + module + "']");
	    if(module != false && (permanent || !element.hasClass("activated"))) {
	        $(".sidebar").addClass("menu");
	        $(".sidebar .pane .item").hide();
	        $(".sidebar .list .item").removeClass("activated");
	        element.addClass("activated");
            $(".sidebar .pane .item[data-key='" + module + "']").show();
            $(".sidebar .controller .title").text(element.find(".name").text());
        } else {
            $(".sidebar").removeClass("menu");
            $(".sidebar .controller .title").text("Menu Panel");
            $(".sidebar .list .item").removeClass("activated");
        }
	},
	submit: function(form) {
        switch(form.attr("name")) {
            case "undo":
                window.editor.undo();
                break;
            case "redo":
                window.editor.redo();
                break;
            case "type-mode":
                this.typeMode(form);
                break;
            case "beautify":
                this.beautify(form);
                break;
            case "line-jump":
                this.jumpToLine(form);
                break;
            case "highlight-line":
                this.highlight(form);
                break;
            case "highlight-word":
                this.search(form);
                break;
            case "invite":
                this.invite(form);
                break;
            case "commit":
                this.commit(form);
                break;
            case "save":
                this.save(form);
                break;
            case "print":
                this.print(form);
                break;
            case "download":
                this.download(form);
                break;
            case "settings":
                this.settings(form);
                break;
        }
	},
	populateLanguages: function() {
        var languages = "";
        $.each(window.editorUtil.languages, function(language, mode) {
            languages += "<option value='" + language + "'>" + language + "</option>";
        });

        $(".form[name='type-mode'] select[name='languages']").html(languages);
	},
	defaultLanguage: function(language) {
        $(".filter[data-key='file-language'] strong").text(language);
        $(".form[name='type-mode'] select[name='languages'] option")
            .filter(function() {
                return ($(this).text() == language);
            })
            .prop('selected', true);
	},
	defaultKeymap: function(keymap) {
	    if(keymap) {
    	    $(".form[name='type-mode'] select[name='keymapping'] option")
                .filter(function() {
                    return ($(this).val() == keymap);
                })
                .prop('selected', true);
        }
	},
	typeMode: function(form) {
	    window.editorUtil.setModeLanguage(form.find("select[name='languages']").val());
        this.keyMap(form.find("select[name='keymapping']").val());
	},
	keyMap: function(keymap) {
	    if(keymap) {
    		window.editor.setOption("keyMap", keymap);
    		$.cookie("keyMap", keymap);
        }
	},
	setTitle: function(direction, title) {
	    var extension = title.split(".")[title.split(".").length - 1];
	    var mode = window.editorUtil.setModeExtension(extension);
	    var beautifiable = (window.sidebarUtil.beautifiable.indexOf(mode) != -1);

		$("#documentTitle").val(title);
		$("#document_title").text(title);
		$("title").text(title + window.config.delimeter + window.config.name);
		$(".sidebar .form[name='beautify']").toggle(beautifiable);
		if(direction == "out") {
    		window.socketUtil.socket.emit('editorExtras' , {
    		    "docName": $("#documentTitle").val()
            });
        }
	},
	togglePassword: function(active) {
        $(".form[name='settings'] input[name='password']")
            .prop("disabled", active);
	},
	beautify: function(form) {
	    var value = window.editor.getValue(),
	        mode = window.editor.getMode().name,
	        select = form.find("select").val(),
	        options = {
	            indent_size: parseInt(select),
	            preserve_newlines: true
	       };

	    if(["javascript"].indexOf(mode) != -1) {
            window.editor.setValue(js_beautify(value, options));
	    } else if(["php", "jade", "htmlembedded", "xml"].indexOf(mode) != -1) {
    	    window.editor.setValue(html_beautify(value, options));
	    } else if(["css", "less", "sass"].indexOf(mode) != -1) {
    	    window.editor.setValue(css_beautify(value, options));
	    }
	}
}
