const contract = require("truffle-contract");

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

const eventEmitterArtifacts = require("../build/contracts/EventEmitter.json");
const EventEmitter = contract(eventEmitterArtifacts);
EventEmitter.setProvider(provider);

const web3 = new Web3(provider);

const getAccounts = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return reject(err);
      }
      return resolve(accounts);
    });
  });
};

describe("EventEmitter", () => {
  let accounts;
  let ee;
  before(async () => {
    accounts = await getAccounts();
    ee = await EventEmitter.deployed();
  });
  it("should have a working constructor", async () => {
    assert(accounts[0] === (await ee.owner()));
  });

  it("should emit an event", async () => {
    // console.log(ee);

    const tag1 = "hello";
    const tag2 = "world";

    let rec = await ee.emitBytes32(tag1, {
      from: accounts[0]
    });

    let tag = Buffer.from(rec.logs[0].args.tag.replace("0x", ""), "hex")
      .toString()
      .replace(/\u0000/g, "");

    assert(tag === tag1);

    rec = await ee.emitBytes32(tag2, {
      from: accounts[0]
    });

    tag = Buffer.from(rec.logs[0].args.tag.replace("0x", ""), "hex")
      .toString()
      .replace(/\u0000/g, "");

    assert(tag === tag2);

    console.log(web3.eth.blockNumber);
  });

  it("supports looking up all events", async () => {
    let allEventLogs = [];
    let latestBlock = web3.eth.blockNumber;
    const allEvents = ee.allEvents({
      fromBlock: 0,
      toBlock: "latest"
    });
    await new Promise((resolve, reject) => {
      allEvents.watch((err, res) => {
        allEventLogs.push(res);
        if ((res.blockNumber = latestBlock)) {
          resolve(allEventLogs);
        }
      });
    });
    console.log(allEventLogs);
  });
});
