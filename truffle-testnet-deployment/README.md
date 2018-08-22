# Testnet Deployments with Truffle

In this tutorial, we'll test and deploy some smart contracts to a live testnet with truffle.

In order to deploy to a live testnet, you should use infura:

https://infura.io/


## Getting Started

```
npm i
npm i -g truffle ganache-cli
ganache-cli
truffle test
npm run generate:wallet
npm run view:wallet:address
```

Fund your deployment address with a faucet:

https://faucet.rinkeby.io/


Deploy to the rinkeby testnet:

```
npm run deploy:rinkeby
```

