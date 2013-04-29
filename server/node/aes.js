/* Requires */
var crypto = require('crypto');

/* Module Exports */
module.exports = {
    encrypt: function(plain, password) {
    if(plain == "") {
        return null;
    } else {
        var cipher 	 = crypto.createCipher('aes-256-cbc', password);
        var crypted  = cipher.update(plain, 'ascii', 'base64');
        crypted += cipher.final('base64');
        return crypted;
    }
},

    decrypt: function(crypted, password) {
        if(crypted == null) {
            return "";
        } else {
            var decipher = crypto.createDecipher('aes-256-cbc', password);
            var decoded  = decipher.update(crypted, 'base64', 'ascii');
            decoded += decipher.final('ascii');
            return decoded;
        }
    }
};