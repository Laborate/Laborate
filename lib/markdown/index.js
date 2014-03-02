var marked = require('marked');
var renderer = new marked.Renderer();
var highlight = require('highlight.js');

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
        return highlight.highlightAuto(code).value;
    }
});

module.exports = function(req) {
    renderer.link = function(href, title, text) {
        text = (text == href) ? (text.slice(0, 35) + "...") : text;
        href = (href.slice(-1) == "/") ? href : (href + "/");
        var link = "<a href='" + href + "' title='" + (title || "") + "'>" + text + "</a>";

        if(href.indexOf(req.host) != -1 || href.indexOf(config.general.security) != -1) {
            if(/.*?\/editor\/.*/.exec(href)) {
                link += "<br><br><div class='iframe'><iframe width='100%' height='400px' src='" + href + "embed/'></iframe></div>";
            }
        }

        return link;
    }

    return marked;
};
