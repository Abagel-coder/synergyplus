const crypto = require('crypto'); 
let key = false; 

/**
 * Encrypts a provided string.
 * @param {string} string - input string to encrypt
 * @returns {string} encrypted string
 */
function encrypt(string) {
  if (!key || key.length !== 16) throw 'KeyError: AES key is either not provided or invalid';  
  if (typeof string !== 'string') throw `InputError: Expcted type "string", got "${typeof string}"`
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'hex'), iv); 
  let out = cipher.update(string, 'utf8', 'base64'); 
  out += cipher.final('base64'); 
  return iv.toString('base64') + '$' + out; 
}

/**
 * Encrypts a provided string.
 * @param {string} string - input string to encrypt
 * @param {string} oid - MongoDB ObjectID of the user
 * @returns {string} encrypted string
 */
function encryptWithOID(string, oid) {
  if (!key || key.length !== 16) throw 'KeyError: AES key is either not provided or invalid';  
  if (!oid || oid.length !== 24) throw 'InputError: OID is either not provided or invalid';  
  if (typeof string !== 'string') throw `InputError: Expcted type "string", got "${typeof string}"`
  const iv = crypto.randomBytes(4); 
  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'hex'), Buffer.concat([Buffer.from(oid, 'hex'), iv])); 
  let out = cipher.update(string, 'utf8', 'base64'); 
  out += cipher.final('base64'); 
  return iv.toString('hex') + '$' + out; 
}

/**
 * Decrypts a provided string. 
 * @param {string} input - encrypted input string
 * @returns {string|boolean} false if invalid, otherwise decoded string
 */
function decrypt(input) {
  if (!key || key.length !== 16) throw 'KeyError: AES key is either not provided or invalid';  
  if (typeof input !== 'string') throw `InputError: Expcted type "string", got "${typeof input}"`
  if (input.indexOf('$') === -1) return false; 
  try {
    const iv = Buffer.from(input.split('$')[0], 'base64'); 
    const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv); 
    let out = cipher.update(input.split('$')[1], 'base64', 'utf8');
    out += cipher.final('utf8'); 
    return out; 
  } catch (err) {
    return false; 
  }
}

/**
 * Decrypts a provided string, using the OID as 12 of the 16 IV bytes. 
 * @param {string} input - encrypted input string
 * @param {string} oid - MongoDB ObjectID of the user
 * @returns {string|boolean} false if invalid, otherwise decoded string
 */
function decryptWithOID(input, oid) {
  if (!key || key.length !== 16) throw 'KeyError: AES key is either not provided or invalid';  
  if (!oid || oid.length !== 24) throw 'InputError: OID is either not provided or invalid';  
  if (typeof input !== 'string') throw `InputError: Expcted type "string", got "${typeof input}"`
  if (input.indexOf('$') === -1) return false; 
  try {
    const iv = Buffer.concat([Buffer.from(oid, 'hex'), Buffer.from(input.split('$')[0], 'hex')]); 
    const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv); 
    let out = cipher.update(input.split('$')[1], 'base64', 'utf8');
    out += cipher.final('utf8'); 
    return out; 
  } catch (err) {
    return false; 
  }
}

module.exports = {
  /**
   * 
   */
  init: (userKey) => {
    if (userKey.length === 32) {
      key = Buffer.from(userKey, 'hex'); 
      return true; 
    } else {
      throw 'KeyError: AES key is invalid';  
    }
  }, 
  encrypt, 
  encryptWithOID, 
  decrypt, 
  decryptWithOID
}