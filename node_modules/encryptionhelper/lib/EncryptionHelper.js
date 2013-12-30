/**
 * Module dependencies.
 */
var crypto = require('crypto'),
    fs = require('fs');

/**
 * `EncryptionHelper` Library.
 * Basic library to do md5/aes256 encryption/decryption for strings or files
 *
 * @api public
 */
var EncryptionHelper = {
  // A helper function to create a one-way md5 hash of a string
  hash: function(data, encryption, outputEncoding, inputEncoding) {
    encryption = encryption || 'md5';

    if (!outputEncoding && outputEncoding !== null) {
      outputEncoding = 'hex';
    }

    if (!inputEncoding && inputEncoding !== null) {
      inputEncoding = 'utf8';
    }

    var md5 = crypto.createHash(encryption);
    md5.update(data, inputEncoding);
    return md5.digest(outputEncoding);
  },
  // A helper function to create a one-way md5 hash of a file
  hashFile: function(file, algo, outputEncoding, inputEncoding, callback) {
    if (inputEncoding && !callback) {
      callback = inputEncoding;
      inputEncoding = undefined;
    }

    if (outputEncoding && !callback) {
      callback = outputEncoding;
      outputEncoding = undefined;
    }

    if (algo && !callback) {
      callback = algo;
      algo = null;
    }

    algo = algo || 'md5';

    if (!outputEncoding && outputEncoding !== null) {
      outputEncoding = 'hex';
    }

    if (!inputEncoding && inputEncoding !== null) {
      inputEncoding = 'utf8';
    }

    var hash = crypto.createHash(algo);

    var fileStream = fs.createReadStream(file, {
      'flags': 'r',
      'encoding': inputEncoding,
      'mode': 0666,
      'bufferSize': 4 * 1024,
    });

    fileStream.on('end', function() {
      var result = hash.digest(outputEncoding);
      return callback(null, result);
    });

    fileStream.on('error', function(ex) {
      return callback(ex, null);
    });

    fileStream.on('data', function(data) {
      hash.update(data, inputEncoding);
    });

    return fileStream;
  },
  // A helper function to create a cipher from a given string.
  // The cipher can be reversed and deciphered to give the orginal string.
  // Default returns a hex encoded string from a utf8 and
  // uses the aes256 algorithm to create the cipher.
  cipher: function(key, text, algo, outputEncoding, inputEncoding) {
    algo = algo || 'aes256';

    if (!outputEncoding && outputEncoding !== null) {
      outputEncoding = 'hex';
    }

    if (!inputEncoding && inputEncoding !== null) {
      inputEncoding = 'utf8';
    }

    var cipher = crypto.createCipher(algo, key);
    return cipher.update(text, inputEncoding, outputEncoding) + cipher.final(outputEncoding);
  },
  // A helper function to dichper a given string.
  // Default returns a utf8 encoded string from a hex string and
  // uses the aes256 algorithm to dechiper the given cipher.
  decipher: function(key, encrypted, algo, outputEncoding, inputEncoding) {
    algo = algo || 'aes256';

    if (!outputEncoding && outputEncoding !== null) {
      outputEncoding = 'utf8';
    }

    if (!inputEncoding && inputEncoding !== null) {
      inputEncoding = 'hex';
    }

    var decipher = crypto.createDecipher(algo, key);
    return decipher.update(encrypted, inputEncoding, outputEncoding) + decipher.final(outputEncoding);
  },
  cipherFile: function(key, file, algo, outputEncoding, inputEncoding, cb) {
    if (inputEncoding && !callback) {
      callback = inputEncoding;
      inputEncoding = undefined;
    }

    if (outputEncoding && !callback) {
      callback = outputEncoding;
      outputEncoding = undefined;
    }

    if (algo && !callback) {
      callback = algo;
      algo = null;
    }

    if (!algo) {
      algo = 'aes256';
    }

    if (!outputEncoding && outputEncoding !== null) {
      outputEncoding = 'hex';
    }

    if (!inputEncoding && inputEncoding !== null) {
      inputEncoding = 'utf8';
    }

    var cipher = crypto.createCipher(algo, key);
    var result = '';

    var fileStream = fs.createReadStream(file, {
      'flags': 'r',
      'encoding': inputEncoding,
      'mode': 0666,
      'bufferSize': 4 * 1024,
    });

    fileStream.on('end', function() {
      result += cipher.final(outputEncoding);
      return callback(null, result);
    });

    fileStream.on('error', function(ex) {
      return callback(ex, null);
    });

    fileStream.on('data', function(data) {
      result += cipher.update(data, inputEncoding, outputEncoding);
    });

    return fileStream;
  },
  decipherFile: function(key, file, algo, outputEncoding, inputEncoding, cb) {
    if (inputEncoding && !callback) {
      callback = inputEncoding;
      inputEncoding = undefined;
    }

    if (outputEncoding && !callback) {
      callback = outputEncoding;
      outputEncoding = undefined;
    }

    if (algo && !callback) {
      callback = algo;
      algo = null;
    }

    if (!algo) {
      algo = 'aes256';
    }

    if (!outputEncoding && outputEncoding !== null) {
      outputEncoding = 'hex';
    }

    if (!inputEncoding && inputEncoding !== null) {
      inputEncoding = 'utf8';
    }

    var decipher = crypto.createDecipher(algo, key);
    var result = '';

    var fileStream = fs.createReadStream(file, {
      'flags': 'r',
      'encoding': inputEncoding,
      'mode': 0666,
      'bufferSize': 4 * 1024,
    });

    fileStream.on('end', function() {
      result += decipher.final(outputEncoding);
      return callback(null, result);
    });

    fileStream.on('error', function(ex) {
      return callback(ex, null);
    });

    fileStream.on('data', function(data) {
      result += decipher.update(data, inputEncoding, outputEncoding);
    });

    return fileStream;
  }
};

/**
 * Expose `EncryptionHelper` Library.
 */
module.exports = EncryptionHelper;
