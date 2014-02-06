exports.type = function(code) {
    switch(code) {
        case "16841":
        case "16877":
            return "dir";
        case "41453":
            return"symlink";
        default:
            return "file";
    }
}
