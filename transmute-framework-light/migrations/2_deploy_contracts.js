const EventEmitter = artifacts.require("./EventEmitter.sol");

module.exports = deployer => {
  deployer.deploy(EventEmitter);
};
