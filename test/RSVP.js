const RSVP = artifacts.require('./RSVP.sol');
const should = require('chai').should();

const POINT_FIVE_ETHER = web3.toWei('0.5', 'ether');
const MAX_ATTENDEES = 2;
const EVENT_NAME = 'Meetup';

contract('RSVP', (accounts) => {
  it('Constructor should init contract with minDeposit set', async () => {
      const RSVPInstance = await RSVP.new(POINT_FIVE_ETHER, EVENT_NAME, MAX_ATTENDEES, accounts[0]);
      const amount = await RSVPInstance.minDeposit();
      assert.equal(web3.fromWei(amount), 0.5);
  });

  it('Constructor should throw with 0 minDeposit', async () => {
    try {
      const RSVPInstance = await RSVP.new(0, EVENT_NAME, 5, accounts[0]);
    }
    catch (error) {
      should.exist(error);
    }
  });

  it('On payable, User should increment the contracts attendee count', async () => {
    const RSVPInstance = await RSVP.new(POINT_FIVE_ETHER, EVENT_NAME, MAX_ATTENDEES, accounts[0]);
    await RSVPInstance.sendTransaction({from: accounts[1], value: POINT_FIVE_ETHER});

    const attenddeCount = await RSVPInstance.attendeeCount.call();

    assert.equal(attenddeCount.toNumber(), 1);
  });


  it('On payable, User should not be able to register if the attendee count is maxed out', async () => {
    const RSVPInstance = await RSVP.new(POINT_FIVE_ETHER, EVENT_NAME, MAX_ATTENDEES, accounts[0]);
    await RSVPInstance.sendTransaction({from: accounts[1], value: POINT_FIVE_ETHER });
    await RSVPInstance.sendTransaction({from: accounts[2], value: POINT_FIVE_ETHER });

    const attenddeCount = await RSVPInstance.attendeeCount.call();

    assert.equal(attenddeCount.toNumber(), 2);

    try {
      await RSVPInstance.sendTransaction({from: accounts[3], value: POINT_FIVE_ETHER });
    }
    catch (error) {
      should.exist(error);
    }
  });


  it('On payable, User and correct amount is added to balances', async () => {
    const RSVPInstance = await RSVP.new(POINT_FIVE_ETHER, EVENT_NAME, MAX_ATTENDEES, accounts[0]);
    await RSVPInstance.sendTransaction({from: accounts[1], value: POINT_FIVE_ETHER});
    const balanceForUser = await RSVPInstance.balances(accounts[1]);
    assert.equal(balanceForUser[0].toNumber(), POINT_FIVE_ETHER);
  });

  it('On payable should throw if msg.value is less than minDeposit', async () => {
    const RSVPInstance = await RSVP.new(POINT_FIVE_ETHER, EVENT_NAME, MAX_ATTENDEES, accounts[0]);
    try {
      await RSVPInstance.sendTransaction({from: accounts[1], value: 1 });
    }
    catch (error) {
      should.exist(error);
    }
  });

  it('On Refund, User should be refunded balance', async () => {
    const RSVPInstance = await RSVP.new(POINT_FIVE_ETHER, EVENT_NAME, MAX_ATTENDEES, accounts[0]);
    await RSVPInstance.sendTransaction({from: accounts[1], value: POINT_FIVE_ETHER});

    let attenddeCount = await RSVPInstance.attendeeCount.call();

    assert.equal(attenddeCount.toNumber(), 1);

    await RSVPInstance.refund(accounts[1], { from: accounts[0] });

    attenddeCount = await RSVPInstance.attendeeCount.call();

    assert.equal(attenddeCount.toNumber(), 0);
  });

  it('On Refund, Contract should adjust attendee count', async () => {
    const RSVPInstance = await RSVP.new(POINT_FIVE_ETHER, EVENT_NAME, MAX_ATTENDEES, accounts[0]);
    await RSVPInstance.sendTransaction({from: accounts[1], value: POINT_FIVE_ETHER});
    let balanceForUser = await RSVPInstance.balances(accounts[1]);
    assert.equal(balanceForUser[0].toNumber(), POINT_FIVE_ETHER);

    const usersBalanceBeforeRefund = await web3.eth.getBalance(accounts[1]);
    await RSVPInstance.refund(accounts[1], { from: accounts[0] });
    const usersBalanceAfteerRefund = await web3.eth.getBalance(accounts[1]);

    assert.equal(usersBalanceAfteerRefund.toNumber(), usersBalanceBeforeRefund.toNumber() + parseFloat(POINT_FIVE_ETHER, 10));
    balanceForUser = await RSVPInstance.balances(accounts[1]);
    assert.equal(balanceForUser[0].toNumber(), 0);
  });

  it('On Refund, User should not be able to stake again', async () => {
    const RSVPInstance = await RSVP.new(POINT_FIVE_ETHER, EVENT_NAME, MAX_ATTENDEES, accounts[0]);
    await RSVPInstance.sendTransaction({from: accounts[1], value: POINT_FIVE_ETHER});
    await RSVPInstance.refund(accounts[1], { from: accounts[0] });

    try {
      await RSVPInstance.sendTransaction({from: accounts[1], value: POINT_FIVE_ETHER});
    }
    catch (error) {
      should.exist(error);
    }
  });
});

