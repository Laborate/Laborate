/* Modules: NPM */
var crypto = require('crypto');

/* Module Exports */
module.exports = {
    encrypt: function(plain, password) {
        try {
            if(plain && password) {
                var cipher = crypto.createCipher('aes-256-cbc', password)
                var crypted = cipher.update(plain,'utf8','hex')
                crypted += cipher.final('hex');
                return crypted;
            } else {
                return null;
            }
        } catch(error) {
            console.log("Encryption Error: " + error.stack);
            return null;
        }
    },

    decrypt: function(crypted, password) {
        try {
            if(crypted && password) {
                var decipher = crypto.createDecipher('aes-256-cbc', password)
                var dec = decipher.update(crypted,'hex','utf8')
                dec += decipher.final('utf8');
                return dec;
            } else {
                return null;
            }
        } catch(error) {
            console.log("Decryption Error: " + error.stack);
            return null;
        }
    }
};
