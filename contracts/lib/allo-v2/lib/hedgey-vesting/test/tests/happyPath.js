const { expect } = require('chai');
const setup = require('../fixtures');
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const C = require('../constants');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

module.exports = (vesting, voting, params) => {
  let s, admin, a, b, c, d, hedgey, token;
  let amount, start, cliff, period, rate, end;
  it(`Creates a ${vesting ? 'vesting' : 'locked'} ${voting ? 'voting' : 'not voting'} token plan`, async () => {
    s = await setup();
    if (vesting && voting) hedgey = s.voteVest;
    else if (!vesting && voting) hedgey = s.voteLocked;
    else if (vesting && !voting) hedgey = s.vest;
    else hedgey = s.locked;
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    d = s.d;
    token = s.token;
    await token.approve(hedgey.address, C.E18_1000000);
    const now = await time.latest();
    amount = params.amount;
    period = params.period;
    rate = params.rate;
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    if (vesting) {
      expect(
        await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, false)
      )
        .to.emit('PlanCreated')
        .withArgs('1', a.address, token.address, amount, start, cliff, end, rate, period, admin.address, false);
    } else {
      expect(await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period))
        .to.emit('PlanCreated')
        .withArgs('1', a.address, token.address, amount, start, cliff, end, rate, period);
    }
    expect(await token.balanceOf(hedgey.address)).to.eq(amount);
    expect(await hedgey.ownerOf('1')).to.eq(a.address);
    expect(await hedgey.balanceOf(a.address)).to.eq(1);
    const plan = await hedgey.plans('1');
    expect(plan.token).to.eq(token.address);
    expect(plan.amount).to.eq(amount);
    expect(plan.start).to.eq(start);
    expect(plan.rate).to.eq(rate);
    expect(plan.period).to.eq(period);
    expect(plan.cliff).to.eq(cliff);
    if (vesting) expect(plan.vestingAdmin).to.eq(admin.address);
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount);
  });
  it('moves forward and checks available balances and partially redeems', async () => {
    let now = BigNumber.from(await time.increase(params.balanceCheck));
    const partialTime = now.sub(C.bigMax(period, 100));
    const calculatedPartial = C.balanceAtTime(start, cliff, amount, rate, period, now, partialTime);
    const calculatedFull = C.balanceAtTime(start, cliff, amount, rate, period, now, now);
    const partial = await hedgey.planBalanceOf('1', now, partialTime);
    const full = await hedgey.planBalanceOf('1', now, now);
    expect(calculatedPartial.balance).to.eq(partial.balance);
    expect(calculatedFull.balance).to.eq(full.balance);
    expect(calculatedPartial.remainder).to.eq(partial.remainder);
    expect(calculatedFull.remainder).to.eq(full.remainder);
    expect(calculatedPartial.latestUnlock).to.eq(partial.latestUnlock);
    expect(calculatedFull.latestUnlock).to.eq(full.latestUnlock);
    expect(await hedgey.connect(a).partialRedeemPlans(['1'], partialTime))
      .to.emit('PlanTokensUnlocked')
      .withArgs('1', calculatedPartial.balance, calculatedPartial.remainder, calculatedPartial.latestUnlock);
    expect(await token.balanceOf(hedgey.address)).to.eq(calculatedPartial.remainder);
    expect(await token.balanceOf(a.address)).to.eq(calculatedPartial.balance);
    const plan = await hedgey.plans('1');
    expect(plan.amount).to.eq(calculatedPartial.remainder);
    expect(plan.start).to.eq(calculatedPartial.latestUnlock);
    expect(plan.rate).to.eq(rate);
    expect(plan.period).to.eq(period);
    expect(plan.cliff).to.eq(cliff);
    expect(await hedgey.balanceOf(a.address)).to.eq(1);
    expect(await hedgey.ownerOf('1')).to.eq(a.address);
    const postPartial = await hedgey.planBalanceOf('1', now, partialTime);
    const postFull = await hedgey.planBalanceOf('1', now, now);
    expect(postPartial.balance).to.eq(0);
    expect(postPartial.remainder).to.eq(partial.remainder);
    expect(postPartial.latestUnlock).to.eq(partial.latestUnlock);
    expect(postFull.balance).to.eq(full.balance.sub(partial.balance));
    expect(postFull.remainder).to.eq(full.remainder);
    expect(postFull.latestUnlock).to.eq(full.latestUnlock);

  });
  it('performs a full redemption of the plan after then end', async () => {
    await time.increaseTo(end);
    const plan = await hedgey.plans('1');
    expect(await hedgey.connect(a).redeemPlans(['1'])).to.emit('PlanTokensUnlocked').withArgs('1', plan.amount, 0, end);
    expect(await token.balanceOf(hedgey.address)).to.eq(0);
    expect(await token.balanceOf(a.address)).to.eq(amount);
    expect(await hedgey.balanceOf(a.address)).to.eq(0);
    await expect(hedgey.ownerOf('1')).to.be.reverted;
  })
  it(`batch creates several ${vesting ? 'vesting' : 'lockup'} ${voting ? 'voting' : 'not voting'} plans`, async () => {
    const batcher = s.batcher;
    await token.approve(batcher.address, C.E18_1000000.mul(1000));
    let singlePlan = {
      recipient: a.address,
      amount,
      start,
      cliff,
      rate
    }
    const batchSize = 50;
    let totalAmount = amount.mul(batchSize);
    let batch = Array(batchSize).fill(singlePlan);
    if (vesting) {
      await batcher.batchVestingPlans(hedgey.address, token.address, totalAmount, batch, period, admin.address, false, '0');
    } else {
      await batcher.batchLockingPlans(hedgey.address, token.address, totalAmount, batch, period, '0');
    }
  });
};
