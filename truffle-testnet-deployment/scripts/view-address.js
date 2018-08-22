const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config();

let wallet = new HDWalletProvider(
  process.env.WALLET_MNEMONIC,
  `https://rinkeby.infura.io/${process.env.INFURA_API_TOKEN}`
);

let deployAddress = wallet.addresses[0];

console.log('🔑 Deploy Address: ', deployAddress);

console.log(`

View address details:

https://rinkeby.etherscan.io/address/${deployAddress}

`);

process.exit(0);
