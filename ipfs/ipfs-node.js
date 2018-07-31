const IPFS = require('ipfs');
const fs = require('fs');

const node = new IPFS();

node.on('ready', async () => {
  // Your node is now ready to use \o/

  let nyanCatGif = fs.readFileSync('./nyan.gif');
  let results = await node.files.add(nyanCatGif);

  let nyanCatGifFromIPFS = await node.files.cat(results[0].path);
  fs.writeFileSync('./nyan-from-ipfs.gif', nyanCatGifFromIPFS);

  // stopping a node
  node.stop(() => {
    // node is now 'offline'
    console.log('node stopped.');
  });
});
