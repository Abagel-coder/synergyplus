const cryptoUtils = require('./cryptoHelper');

try {
    cryptoUtils.init('1A9EBBC86CD57A409031C344E275C996'); // Initialize with AES key
    const encryptedString = "";
    const decryptedString = cryptoUtils.decrypt(encryptedString);
    console.log('Decrypted:', decryptedString);
  } catch (error) {
    console.error('Error:', error);
  }

  // db.sessions.find({ "session.auth.fullName": /xyz/ }).pretty();
  /* 
  db.sessions.find({
    "session.auth.grade": { $in: ["2"] },
    "session.auth.school": "High School"
  }).forEach(function(doc) {
    print(doc.session.auth.fullName);
  });

  
  */ 

