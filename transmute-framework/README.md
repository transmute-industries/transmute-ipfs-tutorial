# Transmute Framework Tutorial

The transmute framework helps you build poc dapps that leverage ethereum and ipfs with truffle.

## Testing Transmute Contracts via Truffle

See the tutorials on ganache and ipfs.

#### [Ganache](../ganache-cli/README.md)

#### [IPFS](../ipfs/README.md)

For convenience, we provide a docker-compose file here, that helps spin up these services. You can also run them locally on your computer, via docker, minikube or remotely.

```
docker-compose up
```

```
npm i -g truffle
npm i
truffle test
```

The framework is designed to provide a redux like interface for managing state built from immutable content addressed events. In order to provide this functionality, it makes use of simple smart contracts and IPFS.

Here is an example:

#### Create an EventStore instance

```
const T = require('transmute-framework');
const AppStore = artifacts.require('./AppStore.sol');

const transmuteConfig = {
  ipfsConfig: {
    host: 'localhost',
    port: 5001,
    protocol: 'http'
  },
  web3Config: {
    providerUrl: 'http://localhost:8545'
  }
};

const eventStore = new T.EventStore({
    eventStoreArtifact: AppStore,
    ...transmuteConfig
});

await eventStore.init();
```

#### Write an event

```
let receipt = await eventStore.write(
    accounts[0],
    {
        type: 'EVENT_WRITTEN'
    },
    {
        message: 'hello world'
    }
);
```

#### Build a model from the event stream

```
const filter = event => {
  // process all events
  return event !== undefined;
};

const reducer = (state, event) => {
  // console.log('event: ', event);
  switch (event.key.type) {
    case 'EVENT_WRITTEN': {
      return {
        ...state,
        messages: (state.messages || []).concat(event.value.message)
      };
    }
    default: {
      return state;
    }
  }
};

const streamModel = new T.StreamModel(eventStore, filter, reducer, null);
await streamModel.sync();
assert.deepEqual(streamModel.state.model, {
    messages: ['hello world']
});
```

See the test directory for more detail, the end result of truffle test should be:

```
› truffle test
Compiling ./contracts/AppStore.sol...
Compiling ./contracts/AppStoreFactory.sol...
Compiling ./contracts/Migrations.sol...
Compiling transmute-framework/contracts/EventStore.sol...
Compiling transmute-framework/contracts/EventStoreFactory.sol...
Compiling transmute-framework/contracts/EventStoreLib.sol...


  Contract: AppStore
    ✓ constructor works
    ✓ works with the transmute-framework (1241ms)


  2 passing (1s)

```

If you encounter errors, it can be useful to find out which process is taking up a port:

```
lsof -i :8545
lsof -i :5001
```

Here is an example of what an event looks like:

```
{
  "event": {
    "sender": "0x6e2c2ead78479b27f6c8e3ff0b9318722b99275a",
    "key": {
      "type": "EVENT_WRITTEN"
    },
    "value": {
      "message": "so does redux!"
    }
  },
  "meta": {
    "tx": "0xfa8b8c2d1649784e269e68195d82fea97e2e38ba5eb7419e8749cea73d6a508a",
    "ipfs": {
      "key": "QmSohXeDaDzW5rJadVYHzbVxiVqqT4hRzUa5TJujZV2kcg",
      "value": "QmaJmJo8Heqz8KQebtLmXP2sDvueLRWvCTKKwYWGXjcqVG"
    },
    "bytes32": {
      "key": "0x425c9e1f3535c3976fa77f5390fb7a7dc91ad96d148dc471edffc8feb42bde89",
      "value": "0xb1d08abfa2b502468b653e7c9b052f17ee5e7a55f2833d725a4c96d98e1fbf3f"
    },
    "receipt": {
      "transactionHash": "0xfa8b8c2d1649784e269e68195d82fea97e2e38ba5eb7419e8749cea73d6a508a",
      "transactionIndex": 0,
      "blockHash": "0xfb5f04858774c0f137e8404ef2f9d00a60f509e20ddb215877425d223c36f028",
      "blockNumber": 55,
      "gasUsed": 116247,
      "cumulativeGasUsed": 116247,
      "contractAddress": null,
      "logs": [
        {
          "logIndex": 0,
          "transactionIndex": 0,
          "transactionHash": "0xfa8b8c2d1649784e269e68195d82fea97e2e38ba5eb7419e8749cea73d6a508a",
          "blockHash": "0xfb5f04858774c0f137e8404ef2f9d00a60f509e20ddb215877425d223c36f028",
          "blockNumber": 55,
          "address": "0xc36d57337e31991b481d7e8fdf71f337f4ea3f25",
          "data": "0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000006e2c2ead78479b27f6c8e3ff0b9318722b99275a425c9e1f3535c3976fa77f5390fb7a7dc91ad96d148dc471edffc8feb42bde89b1d08abfa2b502468b653e7c9b052f17ee5e7a55f2833d725a4c96d98e1fbf3f",
          "topics": [
            "0x4c7900e30963aa4aed068e34036112a44f45ef40623e8892337b84316e5fcb64"
          ],
          "type": "mined"
        }
      ],
      "status": "0x01",
      "logsBloom": "0x00000000000000020000000000000000000000000000000000000000000080000000000000000000000000000008000000000000000000000000000000000004800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000"
    }
  }
}
```


An example of a stream model is:

```
{
  "contractAddress": "0x90e8521dc5b8d4166342e88989c80163df26651f",
  "model": {
    "messages": [
      "hello world",
      "event sourcing rocks!",
      "so does redux!"
    ]
  },
  "lastIndex": 2
}
```