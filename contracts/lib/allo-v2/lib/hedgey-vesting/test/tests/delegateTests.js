const { expect } = require('chai');
const setup = require('../fixtures');
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const C = require('../constants');
const { BigNumber } = require('ethers');

module.exports = (vesting, params) => {
  let s, admin, a, b, c, d, hedgey, token, dai, usdc;
  let amount, start, cliff, period, rate, end;
  it('creates a plan which is by default self delegated', async () => {
    s = await setup();
    hedgey = vesting ? s.vest : s.locked;
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    d = s.d;
    token = s.token;
    dai = s.dai;
    usdc = s.usdc;
    await token.approve(hedgey.address, C.E18_1000000.mul(1000));
    await dai.approve(hedgey.address, C.E18_1000000.mul(1000));
    await usdc.approve(hedgey.address, C.E18_1000000.mul(1000));
    let now = BigNumber.from(await time.latest());
    amount = params.amount;
    period = params.period;
    rate = params.rate;
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount);
    expect(await hedgey.delegatedBalances(a.address, token.address)).to.eq(amount);
  });
  it('delegates the plan to another wallet', async () => {
    await hedgey.connect(a).delegate('1', b.address);
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount);
    expect(await hedgey.delegatedBalances(a.address, token.address)).to.eq(0);
    expect(await hedgey.lockedBalances(b.address, token.address)).to.eq(0);
    expect(await hedgey.delegatedBalances(b.address, token.address)).to.eq(amount);
  });
  it('delegates all of ones plans with the same token to another wallet', async () => {
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount.mul(2));
    expect(await hedgey.delegatedBalances(a.address, token.address)).to.eq(amount);
    expect(await hedgey.lockedBalances(b.address, token.address)).to.eq(0);
    expect(await hedgey.delegatedBalances(b.address, token.address)).to.eq(amount);
    await hedgey.connect(a).delegatePlans(['1', '2'], [c.address, c.address]);
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount.mul(2));
    expect(await hedgey.delegatedBalances(a.address, token.address)).to.eq(0);
    expect(await hedgey.lockedBalances(b.address, token.address)).to.eq(0);
    expect(await hedgey.delegatedBalances(b.address, token.address)).to.eq(0);
    expect(await hedgey.lockedBalances(c.address, token.address)).to.eq(0);
    expect(await hedgey.delegatedBalances(c.address, token.address)).to.eq(amount.mul(2));
  });
  it('when a token is transferred the delegates do not move with it', async () => {
    expect(await hedgey.delegatedBalances(c.address, token.address)).to.eq(amount.mul(2));
    vesting
      ? await hedgey.transferFrom(a.address, b.address, '1')
      : await hedgey.connect(a).transferFrom(a.address, b.address, '1');
    // A has two tokens with amount, so check that its only got 1 amount left
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount);
    expect(await hedgey.lockedBalances(b.address, token.address)).to.eq(amount);
    expect(await hedgey.delegatedBalances(a.address, token.address)).to.eq(0);
    expect(await hedgey.delegatedBalances(b.address, token.address)).to.eq(0);
    // previously delegated to C, so
    expect(await hedgey.delegatedBalances(c.address, token.address)).to.eq(amount.mul(2));
  });
  it('delegates all of its tokens to a single wallet', async () => {
    vesting
      ? await hedgey.transferFrom(a.address, b.address, '2')
      : await hedgey.connect(a).transferFrom(a.address, b.address, '2');
    await hedgey.connect(b).delegateAll(token.address, d.address);
    expect(await hedgey.lockedBalances(b.address, token.address)).to.eq(amount.mul(2));
    expect(await hedgey.delegatedBalances(b.address, token.address)).to.eq(0);
    expect(await hedgey.lockedBalances(d.address, token.address)).to.eq(0);
    expect(await hedgey.delegatedBalances(d.address, token.address)).to.eq(amount.mul(2));
  });
  it('wallet A approves wallet B as a delegator for single NFT, wallet B delegates to various wallets', async () => {
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    expect(await hedgey.connect(a).approveDelegator(b.address, '3'))
      .to.emit('DelegatorApproved')
      .withArgs(a.address, b.address, 3);
    // should still be delegated to wallet A
    expect(await hedgey.delegatedTo(3)).to.eq(a.address);
    expect(await hedgey.connect(b).delegate('3', b.address))
      .to.emit('TokenDelegated')
      .withArgs(3, b.address);
    expect(await hedgey.delegatedTo(3)).to.eq(b.address);
    expect(await hedgey.connect(b).delegate('3', c.address))
      .to.emit('TokenDelegated')
      .withArgs(3, c.address);
    expect(await hedgey.delegatedTo(3)).to.eq(c.address);
    expect(await hedgey.connect(a).delegate('3', d.address))
      .to.emit('TokenDelegated')
      .withArgs(3, d.address);
    expect(await hedgey.delegatedTo(3)).to.eq(d.address);
  });
  it('wallet A revokes the approval of wallet B as a delegator', async () => {
    expect(await hedgey.connect(a).approveDelegator(C.ZERO_ADDRESS, 3))
      .to.emit('DelegatorApproved')
      .withArgs(a.address, C.ZERO_ADDRESS, 3);
    await expect(hedgey.connect(b).delegate(3, b.address)).to.be.revertedWith('!delegator');
  });
  it('wallet A approves wallet C as operator, wallet C, can delegate plans in bulk and also approve other wallets to delegate individual plans', async () => {
    expect(await hedgey.connect(a).setApprovalForAllDelegation(c.address, true))
      .to.emit('ApprovalForAllDelegation')
      .withArgs(a.address, c.address, true);
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    expect(await hedgey.delegatedTo('4')).to.eq(a.address);
    expect(await hedgey.connect(c).delegatePlans(['3', '4'], [d.address, d.address]))
      .to.emit('TokenDelegated')
      .withArgs(3, d.address)
      .to.emit('TokenDelegated')
      .withArgs(4, d.address);
  });
  it('wallet A revokes the approval of C as the operator, and it cannot delegate or approve anyone anymore', async () => {
    expect(await hedgey.connect(a).setApprovalForAllDelegation(c.address, false))
      .to.emit('ApprovalForAllDelegation')
      .withArgs(a.address, c.address, false);
    await expect(hedgey.connect(c).delegate(3, b.address)).to.be.revertedWith('!delegator');
    await expect(hedgey.connect(c).delegatePlans(['3', '4'], [d.address, d.address])).to.be.revertedWith('!delegator');
    await hedgey.connect(a).delegatePlans(['3', '4'], [a.address, a.address]);
  });
  it('wallet A approves wallet B as a delegator, then transfers the NFT which wallet B is not a delegator anymore', async () => {
    if (!vesting) {
      await hedgey.connect(a).approveDelegator(b.address, '4');
      await hedgey.connect(a).transferFrom(a.address, d.address, '4');
      await expect(hedgey.connect(b).delegate('4', b.address)).to.be.revertedWith('!delegator');
      expect(await hedgey.getApprovedDelegator(4)).to.eq(C.ZERO_ADDRESS);
    }
  });
  it('wallet D transfers a token with delegation, and the token transfers and delegation gets transferred to new wallet', async () => {
    if (!vesting) {
      await hedgey.connect(d).delegate('4', d.address);
      expect(await hedgey.delegatedTo('4')).to.eq(d.address);
      expect(await hedgey.connect(d).transferAndDelegate('4', d.address, c.address))
        .to.emit('TokenDelegated')
        .withArgs(4, c.address);
      expect(await hedgey.delegatedTo('4')).to.eq(c.address);
      expect(await hedgey.ownerOf('4')).to.eq(c.address);
    }
  });
  it('reverts if the function caller isnt the owner', async () => {
    await expect(hedgey.connect(a).delegate('1', a.address)).to.be.revertedWith('!delegator');
    await expect(hedgey.connect(a).delegatePlans(['1', '2'], [a.address, d.address])).to.be.revertedWith('!delegator');
  });
  it('reverts delegating multiple tokens if the array legnths are wrong', async () => {
    await expect(hedgey.connect(b).delegatePlans(['1', '2'], [a.address])).to.be.revertedWith('array error');
  });
};
