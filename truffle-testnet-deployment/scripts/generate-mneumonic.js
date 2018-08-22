const bip39 = require('bip39');

// Use this code to generate a mneumonic and save it to your .env
const mnemonic = bip39.generateMnemonic();

console.log(`

💍 Copy this string into WALLET_MNEMONIC in example.env and rename the file .env

`)
console.log(mnemonic);
