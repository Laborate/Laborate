exports.bytes = function(string) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(string).match(/%[89ABab]/g);
    return string.length + (m ? m.length : 0);
}

exports.readable = function(bytes) {
    var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    var v = (bytes / Math.pow(1024, e)).toFixed(1);
    var g = (v.split(".")[1] = "0") ? v.split(".")[0] : v;
    return  g + " " + s[e]
}

exports.size = function(string) {
    return exports.readable(exports.bytes(string));
}
