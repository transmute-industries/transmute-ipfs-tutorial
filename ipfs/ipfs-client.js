const ipfsAPI = require('ipfs-api');
const fs = require('fs');

const ipfs = ipfsAPI({ host: 'localhost', port: '5001', protocol: 'http' });

(async () => {
  let nyanCatGif = fs.readFileSync('./nyan.gif');
  let results = await ipfs.files.add(nyanCatGif);
  let nyanCatGifFromIPFS = await ipfs.files.cat(results[0].path);
  fs.writeFileSync('./nyan-from-ipfs.gif', nyanCatGifFromIPFS);
})();
