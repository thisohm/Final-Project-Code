var CryptoJS = require("crypto-js");
module.exports = generateSHA = (string) => {
    var ciphertext = CryptoJS.AES.encrypt(string, 'secret key 123').toString();
    return ciphertext
}