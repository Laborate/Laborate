var marked = require('marked');
var renderer = new marked.Renderer();
var highlight = require('highlight.js');
var twitter = require('twitter-text');

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

module.exports = function(server) {
    renderer.link = function(href, title, text) {
        text = (text == href) ? (text.slice(0, 35) + "...") : text;
        href = (href.slice(-1) == "/") ? href : (href + "/");
        var link = "<a target='_blank' href='" + href + "' title='" + (title || "") + "'>" + text + "</a>";

        if(href.indexOf(server) != -1 || href.indexOf(config.general.security) != -1) {
            if(/.*?\/editor\/.*/.exec(href)) {
                //TODO: Find A Way Of Activating Iframe On Click
                link += "<div class='iframe'><iframe width='100%' height='400px' src='" + href + "embed/?header=false'></iframe></div>";
            }
        }

        return link;
    }

    renderer.paragraph = function(text) {
        var tags = twitter.extractHashtags(text);
        var users = twitter.extractMentions(text);

        $.each(tags, function(index, tag) {
            text = text.replace(new RegExp("#" + tag, "g"), "<a href='/news/tags/" + tag + "'>#" + tag + "</a>");
        });

        $.each(users, function(index, user) {
            text = text.replace(new RegExp("@" + user, "g"), "<a href='/users/" + user + "'>@" + user + "</a>");
        });

        return "<p>" + text + "</p>";
    }

    return marked;
};
