'use strict';

var chars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()";
// create a key for symmetric encryption
// pass in the desired length of your key
var generateKey = function generateKey(keyLength){
  var randomstring = '';
  
  for (var i=0; i < keyLength; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
};
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

// encrypt a javascript object into a payload to be sent
// to a server or stored on the client
var encrypt = function encrypt(dataObject, publicKey,key) {
 
  // Create a new encryption key (with a specified length)
  // convert data to a json string
  var dataAsString = JSON.stringify(data);
  // encrypt the data symmetrically 
  // (the cryptojs library will generate its own 256bit key!!)
  var aesEncrypted = CryptoJS.AES.encrypt(dataAsString, key);
  // get the symmetric key and initialization vector from
  // (hex encoded) and concatenate them into one string
  var aesKey = aesEncrypted.key + ":::" + aesEncrypted.iv;
  // the data is base64 encoded 
  var encryptedMessage = aesEncrypted.toString();

  // we create a new JSEncrypt object for rsa encryption
  var rsaEncrypt = new JSEncrypt();
  
  // we set the public key (which we passed into the function)
  rsaEncrypt.setPublicKey(publicKey);
  // now we encrypt the key & iv with our public key
  var encryptedKey = rsaEncrypt.encrypt(aesKey);
  // and concatenate our payload message
  var payload = encryptedKey + ":::" + encryptedMessage;
  return payload;
};

module.exports = { decrypt, encrypt, generateKey };