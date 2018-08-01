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
  return event;
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

contract('AppStore', accounts => {
  it('constructor works', async () => {
    const storage = await AppStore.deployed();
    assert(accounts[0] === (await storage.owner()));
  });

  it('works with the transmute-framework', async () => {
    const storage = await AppStore.deployed();
    const eventStore = new T.EventStore({
      eventStoreArtifact: AppStore,
      ...transmuteConfig
    });

    await eventStore.init();
    const streamModel = new T.StreamModel(eventStore, filter, reducer, null);
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
    // assert(typeof receipt.meta !== undefined);

    // syncing updates the model state
    // await streamModel.sync(streamModel.state);
    // assert.deepEqual(streamModel.state.model, {
    //   messages: ['hello world']
    // });

    await eventStore.write(
      accounts[0],
      {
        type: 'EVENT_WRITTEN'
      },
      {
        message: 'event sourcing rocks!'
      }
    );
    // await streamModel.sync(streamModel.state);

    await eventStore.write(
      accounts[0],
      {
        type: 'EVENT_WRITTEN'
      },
      {
        message: 'so does redux!'
      }
    );

    // console.log('');

    let eventCount = (await eventStore.eventStoreContractInstance.count.call()).toNumber();
    // console.log(eventCount)
    await streamModel.sync();
    // console.log(streamModel.state.model);
    // await streamModel.sync();
    // console.log(streamModel.state.model);
    // await streamModel.sync();
    // console.log(streamModel.state.model);
    // assert.deepEqual(streamModel.state.model, {
    //   messages: ['hello world', 'event sourcing rocks!']
    // });
  });
});
