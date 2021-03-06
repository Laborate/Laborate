var _this = exports;
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

exports.parse = function(server) {
    renderer.link = function(href, title, text) {
        text = (text == href) ? (text.slice(0, 35) + ((text.length >= 35) ? "..." : "")) : text;
        var link = "<a target='_blank' href='" + href + "' title='" + (title || "") + "'>" + text + "</a>";

        if(href.indexOf(server) != -1 || href.indexOf(config.general.security) != -1) {
            if(/.*?\/editor\/.*/.exec(href)) {
                href = (href.slice(-1) == "/") ? href : (href + "/");

                //TODO: Find A Way Of Activating Iframe On Click
                link += "<div class='iframe'><iframe width='100%' height='400px' src='" + href + "embed/?header=false'></iframe></div>";
            }
        } else if(/(https?:\/\/.*\.(?:png|jpg|tif|gif))/i.exec(href)) {
            link += "<div class='embed'><a target='_blank' href='" + href + "' title='" + (title || "") + "'>";
            link += "<img src='" + href + "' width='100%'/>";
            link += "</div></a>";
        } else if(/(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/i.exec(href)) {
            var video = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/i.exec(href)[5];
            link += "<div class='embed'>";
            link += "<iframe width='100%' height='400px' src='//www.youtube.com/embed/" + video + "'";
            link += "webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>";
        } else if(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/i.exec(href)) {
            var video = /http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/i.exec(href)[2];
            link += "<div class='embed'>";
            link += "<iframe width='100%' height='400px' src='//player.vimeo.com/video/" + video + "'";
            link += "webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>";
        }

        return link;
    }

    renderer.heading = function (text, level) {
        var text_split = text.split(" ");
        return "<a class='tag' href='/news/tags/" + text_split[0] + "/'>#" + text_split[0] + "</a> " + text_split.slice(1).join(" ");
    }


    renderer.paragraph = function(text) {
        $.each(_this.links("tags", text), function(index, tag) {
            text = text.replace(new RegExp("#" + tag, "g"), "<a class='tag' href='/news/tags/" + tag + "/'>#" + tag + "</a>");
        });

        $.each(_this.links("users", text), function(index, user) {
            text = text.replace(new RegExp("@" + user, "g"), "<a href='/users/" + user + "/'>@" + user + "</a>");
        });

        return "<p>" + text + "</p>";
    }

    return marked;
};

exports.links = function(type, text) {
    switch(type) {
        case "tags":
            return twitter.extractHashtags(text);

        case "users":
            return twitter.extractMentions(text);
    }
}
