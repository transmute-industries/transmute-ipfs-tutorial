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

See the test directory for more detail.