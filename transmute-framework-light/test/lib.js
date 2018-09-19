const reducer = (state, event) => {
  // console.log(state);

  const allEvents = [...(state.events || []), event];

  return {
    lastBlock: event.blockNumber,
    events: allEvents
  };
};

module.exports = class StreamModel {
  constructor(web3, someContract) {
    this.web3 = web3;
    this.contract = someContract;
    this.state = {
      lastBlock: null
    };
  }

  sync() {
    const allEvents = this.contract.allEvents({
      fromBlock: this.state.lastBlock + 1 || 0,
      toBlock: "latest"
    });

    const latestBlock = web3.eth.blockNumber;

    return new Promise((resolve, reject) => {
      allEvents.watch((err, res) => {
        // console.log(res);
        this.state = reducer(this.state, res);
        if (latestBlock >= res.blockNumber) {
          resolve(this.state);
        }
      });
    });
  }
};
