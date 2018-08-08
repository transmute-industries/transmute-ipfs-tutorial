# Transmute IPFS Tutorial

## What is IPFS?

You should really read more about it here: [https://ipfs.io/](https://ipfs.io/). Essentially, its a filesystem that is popular for decentralized application developers, and projects that integrate with blockchain technologies. There are a couple reasons for its popularity, but the main ones are its a very simple interface, it strongly supports decentralization, and storing large amounts of data on blockchains is illadvised and expensive.

## How do I use it?

### [Install IPFS](https://ipfs.io/docs/install/)

Once its installed, you need to init ipfs

```
ipfs init
```

and start a local node:

```
ipfs daemon
```

Once the local node has started, visit:

<http://localhost:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme>
<http://localhost:5001/api/v0/id>
<http://localhost:5001/api/v0/ls?arg=QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG>
<http://localhost:5001/webui>

The service running on `8080` is the Gateway Server.
The service running on `5001` is the API Server.

### Content Addressing vs Location Addressing

In order to understand the magic of IPFS, lets look at the same hashes served from a different location:

<https://ipfs.infura.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme>
<https://ipfs.infura.io:5001/api/v0/id>
<https://ipfs.infura.io:5001/api/v0/cat?arg=QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG>

The hashes are the same, so the content is the same, regardless of location of the server. This is what is meant by content addressing. This allows for apps to request content from any server, including local servers, by hash.

### IPFS & Docker

Build the image, with CORS configured insecurly.

```
docker build -t transmute-ipfs -f ./docker/Dockerfile ./docker
```

Run the image, exposing both gateway and api.

```
docker run -p 8080:8080 -p 5001:5001 transmute-ipfs
```

### IPFS & K8s

```
helm search ipfs
helm install stable/ipfs 
```

### Using Curl with IPFS 

Upload an image:

```
curl -F "image=@./nyan.gif" 127.0.0.1:5001/api/v0/add
```

You will see the hash:

```
{"Name":"nyan.gif","Hash":"QmcX5MyEF5UyqLGQWppBb4JmxnruBFjBpRjUzhCKfCmhmk","Size":"75430"}
```

Now retrieve the image:

```
curl 127.0.0.1:5001/api/v0/cat?arg=QmcX5MyEF5UyqLGQWppBb4JmxnruBFjBpRjUzhCKfCmhmk >> nyan-from-ipfs.gif
```

or use the gateway <http://127.0.0.1:8080/ipfs/QmcX5MyEF5UyqLGQWppBb4JmxnruBFjBpRjUzhCKfCmhmk>

### Running an IPFS Node via Node.JS 

> https://github.com/ipfs/js-ipfs

This code does the same thing as the curl commands above, but runs the IPFS node via node.js and used node.js to add and get files.

See: `./ipfs-node.js`

```
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
```

### Using IFPS via an HTTP Client Library

> https://github.com/ipfs/js-ipfs-api

Most of the time you will want to use a client library to talk to ipfs. This code will only work if you have an ipfs node running locally. It does the same thing as the example above, but uses the ipfs http api, and therefore can be used to talk to ipfs node running as a go service, or on a remote server.

See: `./ipfs-client.js`

```
const ipfsAPI = require('ipfs-api');
const fs = require('fs');

const ipfs = ipfsAPI({ host: 'localhost', port: '5001', protocol: 'http' });

(async () => {
  let nyanCatGif = fs.readFileSync('./nyan.gif');
  let results = await ipfs.files.add(nyanCatGif);
  let nyanCatGifFromIPFS = await ipfs.files.cat(results[0].path);
  fs.writeFileSync('./nyan-from-ipfs.gif', nyanCatGifFromIPFS);
})();
```

### Using IPFS 

First, ipfs is alpha software, its unstable, and you should be careful using it in production. 

Second, you should never store anything private in IPFS without encrypting it first, and you should be aware that if the encryption keys are compromised in the future, the content in IPFS will be compromised. Think of IPFS like a public git repo.

Third, your content is not guaranteed to stay around. You should read more about pinning of content, FileCoin and Swarm if you are interested in content availability.
