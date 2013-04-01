var aes = require('./aes.js');

var password  = 'ajl!k3?242!@#f342$%6456^&*()_`\`a;k:sfj#/?a-]s{df}|';
var plaintext = "bjv0623";

var ciphertext = aes.encrypt(plaintext, password);
var decoded = aes.decrypt(ciphertext, password);

console.log("Wanted:\nheExSdrcslpKafUjx/mjR2mYtTuqMZb/Y64SrFSSVtY=\n");
console.log("Encrypted:\n" + ciphertext + "\n");
console.log("Decrypted:\n" + decoded + "\n");

console.log("Test:");
console.log((decoded === plaintext ? 'Text matches, all okay.' : 'Problems...'));