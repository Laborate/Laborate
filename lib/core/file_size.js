exports.bytes = function(string) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(string).match(/%[89ABab]/g);
    return string.length + (m ? m.length : 0);
}

exports.readable = function(bytes) {
    var s = ['byte', 'bytes', 'kb', 'mb', 'gb', 'tb', 'pd'];

    if(bytes != 0) {
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        var v = (bytes / Math.pow(1024, e)).toFixed(2);
        var g = (v.split(".")[1] = "0") ? v.split(".")[0] : v;
        return  g + " " + s[e + ((v == 1) ? 0 : 1)];
    } else {
        return 0 + " " + s[1];
    }
}

exports.size = function(string) {
    return this.readable(this.bytes(string));
}
