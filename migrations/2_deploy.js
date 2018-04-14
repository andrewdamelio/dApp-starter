const RSVP = artifacts.require('./RSVP.sol');
const faker = require('faker');

module.exports = function(deployer, network) {
  deployer.deploy(RSVP, web3.toWei(0.05, 'ether'), 'Meetup RSVP', 20, web3.eth.accounts[0])
  .then(() => {
      return RSVP.deployed();
  })
  .then((instance) => {
    instance.register(faker.name.findName(), { from: web3.eth.accounts[1], value: web3.toWei(0.05, 'ether') });
    instance.register(faker.name.findName(), { from: web3.eth.accounts[2], value: web3.toWei(0.05, 'ether') });
  });
};
