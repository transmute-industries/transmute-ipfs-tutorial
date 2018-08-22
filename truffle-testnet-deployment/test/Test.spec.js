const Test = artifacts.require('./Test.sol');

contract('Test', accounts => {
  it('constructor works', async () => {
    const test = await Test.deployed();
    assert(accounts[0] === (await test.owner()));
  });
});
