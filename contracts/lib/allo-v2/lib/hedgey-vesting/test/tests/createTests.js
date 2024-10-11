const { expect } = require('chai');
const setup = require('../fixtures');
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const C = require('../constants');
const { BigNumber } = require('ethers');

const createTests = (vesting, voting, params) => {
  let s, admin, a, b, c, d, hedgey, token;
  let amount, start, cliff, period, rate, end;
  it(`mints a ${vesting ? 'vesting' : 'locked'} plan with ${
    voting ? 'on-chain voting' : 'snapshot voting'
  }`, async () => {
    s = await setup();
    if (vesting && voting) hedgey = s.voteVest;
    else if (!vesting && voting) hedgey = s.voteLocked;
    else if (vesting && !voting) hedgey = s.vest;
    else hedgey = s.locked;
    admin = s.admin;
    a = s.a;
    b = s.b;
    token = s.token;
    await token.approve(hedgey.address, C.E18_1000000.mul(10000));
    let now = await time.latest();
    amount = params.amount;
    period = params.period;
    rate = params.rate;
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    if (vesting) {
      expect(await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true))
        .to.emit('PlanCreated')
        .withArgs('1', a.address, token.address, amount, start, cliff, end, rate, period, admin.address, true);
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
  it('mints a second token to the same wallet holder', async () => {
    if (vesting) {
      expect(await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true))
        .to.emit('PlanCreated')
        .withArgs('1', a.address, token.address, amount, start, cliff, end, rate, period, admin.address, true);
    } else {
      expect(await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period))
        .to.emit('PlanCreated')
        .withArgs('1', a.address, token.address, amount, start, cliff, end, rate, period);
    }
    expect(await token.balanceOf(hedgey.address)).to.eq(amount.mul(2));
    expect(await hedgey.ownerOf('2')).to.eq(a.address);
    expect(await hedgey.balanceOf(a.address)).to.eq(2);
    const plan = await hedgey.plans('2');
    expect(plan.token).to.eq(token.address);
    expect(plan.amount).to.eq(amount);
    expect(plan.start).to.eq(start);
    expect(plan.rate).to.eq(rate);
    expect(plan.period).to.eq(period);
    expect(plan.cliff).to.eq(cliff);
    if (vesting) expect(plan.vestingAdmin).to.eq(admin.address);
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount.mul(2));
  });
  it('batch mints several plans at the same time with the batch planner', async () => {
    const batcher = s.batcher;
    await token.approve(batcher.address, C.E18_1000000.mul(1000));
    let singlePlan = {
      recipient: a.address,
      amount,
      start,
      cliff,
      rate,
    };
    const batchSize = 50;
    let totalAmount = amount.mul(batchSize);
    let batch = Array(batchSize).fill(singlePlan);
    let tx;
    if (vesting) {
      tx = await batcher.batchVestingPlans(
        hedgey.address,
        token.address,
        totalAmount,
        batch,
        period,
        admin.address,
        true,
        '40'
      );
    } else {
      tx = await batcher.batchLockingPlans(hedgey.address, token.address, totalAmount, batch, period, '40');
    }
    expect(tx).to.emit('BatchCreated').withArgs('40');
    for (let i = 0; i < batchSize; i++) {
      vesting
        ? expect(tx)
            .to.emit('PlanCreated')
            .withArgs(i + 3, a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
        : expect(tx)
            .to.emit('PlanCreated')
            .withArgs(i + 3, a.address, token.address, amount, start, cliff, rate, period);
    }
    expect(await token.balanceOf(hedgey.address)).to.eq(amount.mul(2).add(totalAmount));
  });
  it('wallet A transfers a tokent to wallet B, if vesting the vesting admin transfers', async () => {
    vesting
      ? expect(await hedgey.connect(admin).transferFrom(a.address, b.address, '1'))
          .to.emit('Transfer')
          .withArgs(a.address, b.address, '1')
      : expect(await hedgey.connect(a).transferFrom(a.address, b.address, '1'))
          .to.emit('Transfer')
          .withArgs(a.address, b.address, '1');
    expect(await hedgey.ownerOf('1')).to.eq(b.address);
    expect(await hedgey.balanceOf(b.address)).to.eq(1);
    expect(await hedgey.lockedBalances(b.address, token.address)).to.eq(amount);
  });
};

const createErrorTests = (vesting, voting) => {
  let s, admin, a, b, hedgey, batcher, token;
  let amount, start, cliff, period, rate, end, batch;
  it('create and batch will revert if the recipient is the 0 address', async () => {
    s = await setup();
    if (vesting && voting) hedgey = s.voteVest;
    else if (!vesting && voting) hedgey = s.voteLocked;
    else if (vesting && !voting) hedgey = s.vest;
    else hedgey = s.locked;
    batcher = s.batcher;
    admin = s.admin;
    a = s.a;
    b = s.b;
    token = s.token;
    await token.approve(hedgey.address, C.E18_1000000);
    await token.approve(batcher.address, C.E18_1000000);
    let now = await time.latest();
    amount = C.E18_1000;
    period = C.DAY;
    rate = C.E18_1;
    start = now;
    cliff = now;
    batch = [
      {
        recipient: C.ZERO_ADDRESS,
        amount,
        start,
        rate,
        cliff,
      },
    ];
    if (vesting) {
      await expect(
        hedgey.createPlan(C.ZERO_ADDRESS, token.address, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('0_recipient');
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('0_recipient');
    } else {
      await expect(
        hedgey.createPlan(C.ZERO_ADDRESS, token.address, amount, start, cliff, rate, period)
      ).to.be.revertedWith('0_recipient');
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('0_recipient');
    }
  });
  it('create and batch will revert if the token is the 0 address', async () => {
    batch[0].recipient = a.address;
    if (vesting) {
      await expect(
        hedgey.createPlan(a.address, C.ZERO_ADDRESS, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('0_token');
      await expect(
        batcher.batchVestingPlans(hedgey.address, C.ZERO_ADDRESS, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('0_token');
    } else {
      await expect(hedgey.createPlan(a.address, C.ZERO_ADDRESS, amount, start, cliff, rate, period)).to.be.revertedWith(
        '0_token'
      );
      await expect(
        batcher.batchLockingPlans(hedgey.address, C.ZERO_ADDRESS, amount, batch, period, '1')
      ).to.be.revertedWith('0_token');
    }
  });
  it('create and batch will revert if the amount is 0', async () => {
    amount = C.ZERO;
    batch[0].amount = amount;
    if (vesting) {
      await expect(
        hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('0_amount');
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, C.E18_1, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('0_amount');
    } else {
      await expect(hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period)).to.be.revertedWith(
        '0_amount'
      );
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, C.E18_1, batch, period, '1')
      ).to.be.revertedWith('0_amount');
    }
    amount = C.E18_1000;
    batch[0].amount = amount;
  });
  it('create and batch will revert if the rate is 0', async () => {
    rate = C.ZERO;
    batch[0].rate = rate;
    if (vesting) {
      await expect(
        hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('0_rate');
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('0_rate');
    } else {
      await expect(hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period)).to.be.revertedWith(
        '0_rate'
      );
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('0_rate');
    }
  });
  it('create and batch will revert if the rate is greater than the amount', async () => {
    rate = C.E18_10000;
    batch[0].rate = rate;
    if (vesting) {
      await expect(
        hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('rate > amount');
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('rate > amount');
    } else {
      await expect(hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period)).to.be.revertedWith(
        'rate > amount'
      );
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('rate > amount');
    }
    rate = C.E18_1;
    batch[0].rate = rate;
  });
  it('create and batch will revert if the period is 0', async () => {
    period = C.ZERO;
    if (vesting) {
      await expect(
        hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('0_period');
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('0_period');
    } else {
      await expect(hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period)).to.be.revertedWith(
        '0_period'
      );
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('0_period');
    }
    period = C.DAY;
  });
  it('create and batch will revert if cliff is greater than the end', async () => {
    end = C.planEnd(start, amount, rate, period);
    cliff = end.add(10);
    batch[0].cliff = cliff;
    if (vesting) {
      await expect(
        hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('cliff > end');
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('cliff > end');
    } else {
      await expect(hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period)).to.be.revertedWith(
        'cliff > end'
      );
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('cliff > end');
    }
    cliff = start;
    batch[0].cliff = cliff;
  });
  it('create and batch will revert if the user has not approved sufficient token allowance', async () => {
    await token.approve(hedgey.address, C.E18_1);
    await token.approve(batcher.address, C.E18_1);
    if (vesting) {
      await expect(
        hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('ERC20: insufficient allowance');
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('ERC20: insufficient allowance');
    } else {
      await expect(hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period)).to.be.revertedWith(
        'ERC20: insufficient allowance'
      );
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('ERC20: insufficient allowance');
    }
    await token.approve(hedgey.address, C.E18_10000);
    await token.approve(batcher.address, C.E18_10000);
  });
  it('create and batch will revert if the user does not have sufficient tokens', async () => {
    await token.connect(a).mint(C.E18_1);
    await token.connect(a).approve(hedgey.address, C.E18_10000);
    await token.connect(a).approve(batcher.address, C.E18_10000);
    if (vesting) {
      await expect(
        hedgey.connect(a).createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, false)
      ).to.be.revertedWith('THL01');
      await expect(
        batcher
          .connect(a)
          .batchVestingPlans(hedgey.address, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('THL01');
    } else {
      await expect(
        hedgey.connect(a).createPlan(a.address, token.address, amount, start, cliff, rate, period)
      ).to.be.revertedWith('THL01');
      await expect(
        batcher.connect(a).batchLockingPlans(hedgey.address, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('THL01');
    }
  });
  it('batch will revert if the total amount is 0', async () => {
    let total = C.ZERO;
    if (vesting) {
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, total, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('0_totalAmount');
    } else {
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, total, batch, period, '1')
      ).to.be.revertedWith('0_totalAmount');
    }
  });
  it('batch will revert if the locker address is 0', async () => {
    if (vesting) {
      await expect(
        batcher.batchVestingPlans(C.ZERO_ADDRESS, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('0_locker');
    } else {
      await expect(
        batcher.batchLockingPlans(C.ZERO_ADDRESS, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('0_locker');
    }
  });
  it('batch will revert if the plans batch length is 0', async () => {
    let batch = [];
    if (vesting) {
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, amount, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('no plans');
    } else {
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, amount, batch, period, '1')
      ).to.be.revertedWith('no plans');
    }
  });
  it('batch will revert if the total amount is different than the total of vesting plans generated', async () => {
    let total = C.E18_10;
    if (vesting) {
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, total, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('THL01');
    } else {
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, total, batch, period, '1')
      ).to.be.revertedWith('THL01');
    }
    total = C.E18_10000;
    if (vesting) {
      await expect(
        batcher.batchVestingPlans(hedgey.address, token.address, total, batch, period, admin.address, false, '1')
      ).to.be.revertedWith('totalAmount error');
    } else {
      await expect(
        batcher.batchLockingPlans(hedgey.address, token.address, total, batch, period, '1')
      ).to.be.revertedWith('totalAmount error');
    }
  });
};

module.exports = {
  createTests,
  createErrorTests,
};
