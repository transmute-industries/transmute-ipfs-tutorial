const Test = artifacts.require('./Test.sol');

module.exports = deployer => {
  deployer.deploy(Test);
};
