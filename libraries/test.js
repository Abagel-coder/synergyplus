const cryptoUtils = require('./cryptoHelper');


try {
   cryptoUtils.init('1A9EBBC86CD57A409031C344E275C996'); // Initialize with AES key
   const encryptedString = "R9fdVZf6LWYoHfraAOJ/Mg==$eRyGL6GMaZqH7j1cJ5OQmQ==";
   const decryptedString = cryptoUtils.decrypt(encryptedString);
   console.log('Decrypted:', decryptedString);
 } catch (error) {
   console.error('Error:', error);
 }
