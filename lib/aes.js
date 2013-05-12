/* Modules: NPM */
var crypto = require('crypto');

/* Module Exports */
module.exports = {
    encrypt: function(plain, password) {
        try {
            if(plain == "") {
                return null;
            } else {
                var cipher 	 = crypto.createCipher('aes-256-cbc', password);
                var crypted  = cipher.update(plain, 'utf-8', 'base64');
                crypted += cipher.final('base64');
                return crypted;
            }
        } catch(error) {
            console.log("Encryption Error: " + error);
            return null;
        }
    },

    decrypt: function(crypted, password) {
        try {
            if(crypted == null) {
                return "";
            } else {
                var decipher = crypto.createDecipher('aes-256-cbc', password);
                var decoded  = decipher.update(crypted, 'base64', 'utf-8');
                decoded += decipher.final('utf-8');
                return decoded;
            }
        } catch(error) {
            console.log("Decryption Error: " + error);
            return null;
        }
    }
};