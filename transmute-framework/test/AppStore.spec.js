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

const filter = event => {
  // process all events
  // return event.key.type === 'Patient';
  // return event !== null && event !== undefined && typeof event === 'object';
  return event;
};

const reducer = (state, event) => {
  // console.log('event: ', event);
  switch (event.key.type) {
    case 'EVENT_WRITTEN': {
      return {
        ...state,
        // accumulate all messages in state.messages property
        messages: (state.messages || []).concat(event.value.message)
      };
    }
    default: {
      return state;
    }
  }
};

// Like describe but for smart contracts
// gives a new instance of the contract deployed to the ethereum test network via truffle
// useful for testing smart contracts.
// provides web3 accounts with test ETH
// By default contracts are deployed from accounts[0].
contract('AppStore', accounts => {
  it('constructor works', async () => {
    const storage = await AppStore.deployed();
    assert(accounts[0] === (await storage.owner()));
  });

  it('works with the transmute-framework', async () => {
    // This instance provides an Event Sourced interface to Ethereum and IPFS
    const eventStore = new T.EventStore({
      eventStoreArtifact: AppStore,
      ...transmuteConfig
    });

    // It must be initialized before being called, this confirms it is deployed to the network.
    await eventStore.init();

    // This instance uses common redux functionality to accumulate state from events stored on Etheruem and IPFS.
    const streamModel = new T.StreamModel(eventStore, filter, reducer, null);

    // Events are downloaded from Ethereum and IPFS and processed in the streamModel state.
    await streamModel.sync();

    // the model starts empty
    assert.deepEqual(streamModel.state.model, {});

    // writing event returns a receipt
    let receipt = await eventStore.write(
      accounts[0],
      {
        type: 'EVENT_WRITTEN'
      },
      {
        message: 'hello world'
      }
    );

    // meta data contains information about the ethereum transaction and ipfs hashes of the key and value objects.
    assert(typeof receipt.meta !== undefined);

    // syncing updates the model state
    await streamModel.sync();

    // Now the model state has been updated, as an event exists and has been processed.
    assert.deepEqual(streamModel.state.model, {
      messages: ['hello world']
    });

    // Here we write a new event.
    await eventStore.write(
      accounts[0],
      {
        type: 'EVENT_WRITTEN'
      },
      {
        message: 'event sourcing rocks!'
      }
    );

    // And another new event.
    let event = await eventStore.write(
      accounts[0],
      {
        type: 'EVENT_WRITTEN'
      },
      {
        message: 'so does redux!'
      }
    );

    // console.log(JSON.stringify(event, null, 2))

    // calling sync when no changes have occurred does nothing.
    await streamModel.sync();
    await streamModel.sync();
    
    // calling sync does not change the model state if no new events exist, or the reducer does not handle them.
    assert.deepEqual(streamModel.state.model, {
      messages: ['hello world', 'event sourcing rocks!', 'so does redux!']
    });
    await streamModel.sync();
    assert.deepEqual(streamModel.state.model, {
      messages: ['hello world', 'event sourcing rocks!', 'so does redux!']
    });

    // Now we can save this model state to a JSON / NoSQL database, and perform queries or 
    // analysis on objects which are built from an immutable audit log.
    // ... db.save(key, streamModel.state.model)

    // console.log(JSON.stringify(streamModel.state, null, 2))
  


  });
});
