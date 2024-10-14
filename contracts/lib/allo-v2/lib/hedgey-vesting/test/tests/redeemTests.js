const { expect } = require('chai');
const setup = require('../fixtures');
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const C = require('../constants');
const { BigNumber } = require('ethers');

const redeemTests = (vesting, voting, params) => {
  let s, admin, a, b, c, d, hedgey, token, dai, usdc, batcher;
  let amount, start, cliff, period, rate, end;
  it(`it mints a ${vesting ? 'vesting' : 'lockup'} plan, and confirms various balance checks`, async () => {
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
    dai = s.dai;
    usdc = s.usdc;
    batcher = s.batcher;
    await token.approve(batcher.address, C.E18_1000000.mul(900000));
    await token.approve(hedgey.address, C.E18_1000000.mul(900000));
    await dai.approve(hedgey.address, C.E18_1000000.mul(900000));
    let now = await time.latest();
    amount = params.amount;
    period = params.period;
    rate = params.rate;
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    let planId = '1';
    expect(await hedgey.planEnd(planId)).to.eq(end);
    now = await time.latest();
    // check time for one period from start, two periods from start, cliff date, one period after cliff, two periods after cliff, end date
    let check = start.add(C.bigMax(period, 2));
    let checkNow = await hedgey.planBalanceOf(planId, now, check);
    let _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, now, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check.sub(period));
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check.sub(period));
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    check = cliff;
    checkNow = await hedgey.planBalanceOf(planId, now, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, now, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check.sub(period));
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check.sub(period));
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    check = cliff.add(C.bigMax(period, 100));
    checkNow = await hedgey.planBalanceOf(planId, now, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, now, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check.sub(period));
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check.sub(period));
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    check = check.add(C.bigMax(period, 100));
    checkNow = await hedgey.planBalanceOf(planId, now, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, now, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check.sub(period));
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check.sub(period));
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    check = end;
    checkNow = await hedgey.planBalanceOf(planId, now, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, now, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check.sub(period));
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check.sub(period));
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);

    checkNow = await hedgey.planBalanceOf(planId, check, check);
    _checkNow = C.balanceAtTime(start, cliff, amount, rate, period, check, check);
    expect(checkNow.balance).to.eq(_checkNow.balance);
    expect(checkNow.remainder).to.eq(_checkNow.remainder);
    expect(checkNow.latestUnlock).to.eq(_checkNow.latestUnlock);
  });
  it('redeems a single plan with multiple partial redemptions', async () => {
    let difference = cliff.add(C.bigMax(period, 100)).sub(await time.latest());
    let redemptionTime = BigNumber.from(await time.increase(difference));
    let now = await time.latest();
    let t_0 = redemptionTime;
    const end = await hedgey.planEnd('1');
    let cb = C.balanceAtTime(start, cliff, amount, rate, period, now, redemptionTime);
    let tx = await hedgey.connect(a).partialRedeemPlans(['1'], redemptionTime);
    expect(tx).to.emit('PlanRedeemed').withArgs('1', cb.balance, cb.remainder, cb.latestUnlock);
    expect(await token.balanceOf(hedgey.address)).to.eq(amount.sub(cb.balance));
    expect(await token.balanceOf(a.address)).to.eq(cb.balance);
    let endCheck = await hedgey.planEnd('1');
    expect(end).to.eq(endCheck);
    now = await time.increase((C.bigMax(period, 100)).mul(3));
    redemptionTime = BigNumber.from(now).sub(period);
    let periods = redemptionTime.sub(t_0).div(period);
    const preBalance = await token.balanceOf(a.address);
    expect((await hedgey.planBalanceOf('1', now, redemptionTime)).balance).to.eq(periods.mul(rate));
    expect(await hedgey.connect(a).partialRedeemPlans(['1'], redemptionTime))
      .to.emit('PlanRedeemed')
      .withArgs('1', cb.balance, cb.remainder, cb.latestUnlock);
    expect(await token.balanceOf(a.address)).to.eq(preBalance.add(periods.mul(rate)));
    expect(await token.balanceOf(hedgey.address)).to.eq(amount.sub(preBalance.add(periods.mul(rate))));
    endCheck = await hedgey.planEnd('1');
    expect(end).to.eq(endCheck);
    difference = end.sub(now);
    await time.increase(difference.add(C.bigMax(period, 100)));
    expect(await hedgey.connect(a).partialRedeemPlans(['1'], end))
      .to.emit('PlanRedeemed')
      .withArgs('1', cb.remainder, 0, end);
    expect(await token.balanceOf(a.address)).to.eq(amount);
    expect(await token.balanceOf(hedgey.address)).to.eq(0);
    expect(await hedgey.balanceOf(a.address)).to.eq(0);
    await expect(hedgey.ownerOf('1')).to.be.reverted;
  });
  it('redeems multiple plans with multiple partial redemptions', async () => {
    let now = await time.latest();
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    let singlePlan = {
      recipient: b.address,
      amount,
      start,
      cliff,
      rate,
    };
    const batchSize = 5;
    let totalAmount = amount.mul(batchSize);
    let batch = Array(batchSize).fill(singlePlan);
    let tx = vesting
      ? await batcher.batchVestingPlans(
          hedgey.address,
          token.address,
          totalAmount,
          batch,
          period,
          admin.address,
          true,
          '0'
        )
      : await batcher.batchLockingPlans(hedgey.address, token.address, totalAmount, batch, period, '0');
    // plans 2 - 6
    await time.increaseTo(cliff.add(C.bigMax(period, 100)));
    now = await time.latest();
    const partial = C.balanceAtTime(start, cliff, amount, rate, period, now, cliff).balance;
    const periods = cliff.sub(start).div(period);
    await hedgey.connect(b).partialRedeemPlans(['2', '3', '4', '5', '6'], cliff);
    expect(await token.balanceOf(b.address)).to.eq(partial.mul(5));
    expect(await token.balanceOf(b.address)).to.eq(periods.mul(rate).mul(5));
  });
  it('redeems muliple partials, skipping one that had previously been redeemed', async () => {
    // previous 5 have been redeemed at cliff - move forward to 3 periods and redeem number 3
    now = await time.increase(C.bigMax(period, 100).mul(3));
    let tx = await hedgey.connect(b).partialRedeemPlans(['3'], now);
    const amountRedeemed = (await tx.wait()).events[1].args.amountRedeemed;
    let bal = await token.balanceOf(b.address);
    const plan3 = await hedgey.plans('3');
    await hedgey.connect(b).partialRedeemPlans(['2', '3', '4', '5', '6'], now);
    const _plan3 = await hedgey.plans('3');
    expect(plan3.amount).to.eq(_plan3.amount);
    expect(plan3.start).to.eq(_plan3.start);
  });
  it('redeems a single plan with multiple normal redemptions', async () => {
    // each balance check assumes 1 second of time increase between calculating and processing block
    let now = await time.latest();
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(c.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(c.address, token.address, amount, start, cliff, rate, period);
    // redeem pre cliff - nothing should redeem
    await hedgey.connect(c).redeemPlans(['7']);
    expect(await token.balanceOf(c.address)).to.eq(0);
    await time.increase(cliff.sub(now));
    now = BigNumber.from(await time.latest());
    let check = C.balanceAtTime(start, cliff, amount, rate, period, now.add(1), now.add(1));
    let endCheck = await hedgey.planEnd('7');
    expect(end).to.eq(endCheck);
    expect(await hedgey.connect(c).redeemPlans(['7']))
      .to.emit('PlanRedeemed')
      .withArgs('7', check.balance, check.remainder, check.latestUnlock);
    expect(await token.balanceOf(c.address)).to.eq(check.balance);
    let plan = await hedgey.plans('7');
    endCheck = await hedgey.planEnd('7');
    expect(end).to.eq(endCheck);
    expect(plan.start).to.eq(check.latestUnlock);
    expect(plan.amount).to.eq(check.remainder);
    // progress forward in time a few periods
    now = BigNumber.from(await time.increase(C.bigMax(period, 100).mul(4)));
    let _check = C.balanceAtTime(check.latestUnlock, cliff, check.remainder, rate, period, now.add(1), now.add(1));
    expect(await hedgey.connect(c).redeemPlans(['7']))
      .to.emit('PlanRedeemed')
      .withArgs('7', _check.balance, _check.remainder, _check.latestUnlock);
    const bal = _check.balance.add(check.balance);
    expect(await token.balanceOf(c.address)).to.eq(bal);
    plan = await hedgey.plans('7');
    expect(plan.start).to.eq(_check.latestUnlock);
    expect(plan.amount).to.eq(_check.remainder);
    // fully redeem it
    endCheck = await hedgey.planEnd('7');
    expect(end).to.eq(endCheck);
    now = BigNumber.from(await time.increase(end.sub(cliff)));
    let finalCheck = C.balanceAtTime(
      _check.latestUnlock,
      cliff,
      _check.remainder,
      rate,
      period,
      now.add(1),
      now.add(1)
    );
    expect(finalCheck.remainder).to.eq(0);
    expect(await hedgey.connect(c).redeemPlans(['7']))
      .to.emit('PlanRedeemed')
      .withArgs('7', finalCheck.balance, 0, end);
    expect(await token.balanceOf(c.address)).to.eq(amount);
    expect(await hedgey.balanceOf(c.address)).to.eq(0);
  });
  it('redeems multiple plans with multiple normal redemptions', async () => {
    // plans 8 - 12
    let now = await time.latest();
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    let singlePlan = {
      recipient: d.address,
      amount,
      start,
      cliff,
      rate,
    };
    const batchSize = 5;
    let totalAmount = amount.mul(batchSize);
    let batch = Array(batchSize).fill(singlePlan);
    let tx = vesting
      ? await batcher.batchVestingPlans(
          hedgey.address,
          token.address,
          totalAmount,
          batch,
          period,
          admin.address,
          true,
          '10'
        )
      : await batcher.batchLockingPlans(hedgey.address, token.address, totalAmount, batch, period, '10');
    // plans 2 - 6
    now = BigNumber.from(await time.increase(params.cliff.add(C.bigMax(period, 100).mul(3))));
    let check = C.balanceAtTime(start, cliff, amount, rate, period, now.add(1), now.add(1));
    let redeemTx = await hedgey.connect(d).redeemPlans(['8', '9', '10', '11', '12']);
    for (let i = 0; i < 5; i++) {
      expect(redeemTx)
        .to.emit('PlanRedeemed')
        .withNamedArgs(i + 8, check.balance, check.remainder, check.latestUnlock);
    }
    expect(await token.balanceOf(d.address)).to.eq(check.balance.mul(5));
  });
  it('redeems multiple plans with the redeemAll redemption', async () => {
    let now = await time.latest();
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(a.address, dai.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, dai.address, amount, start, cliff, rate, period);
    now = BigNumber.from(await time.increase(params.cliff.add(C.bigMax(period, 100).mul(3))));
    let check = C.balanceAtTime(start, cliff, amount, rate, period, now.add(1), now.add(1));
    expect(await hedgey.connect(a).redeemAllPlans())
      .to.emit('PlanRedeemed')
      .withArgs('13', check.balance, check.remainder, check.latestUnlock);
    expect(await dai.balanceOf(a.address)).to.eq(check.balance);
    expect(await dai.balanceOf(hedgey.address)).to.eq(check.remainder);
    expect((await hedgey.plans('13')).start).to.eq(check.latestUnlock);
    expect((await hedgey.plans('13')).amount).to.eq(check.remainder);
  });
  it('redeems a partial, then a normal, and then an all redemption', async () => {
    let now = await time.latest();
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(d.address, dai.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(d.address, dai.address, amount, start, cliff, rate, period);
    await time.increaseTo(cliff.add(C.bigMax(period, 100).mul(3)));
    now = BigNumber.from(await time.latest());
    let partialCheck = C.balanceAtTime(start, cliff, amount, rate, period, now.add(1), cliff.sub(period));
    expect(await hedgey.connect(d).partialRedeemPlans(['14'], cliff.sub(period)))
      .to.emit('PlanRedeemed')
      .withArgs('14', partialCheck.balance, partialCheck.remainder, partialCheck.latestUnlock);
    expect(await dai.balanceOf(d.address)).to.eq(partialCheck.balance);
    expect((await hedgey.plans('14')).amount).to.eq(partialCheck.remainder);
    expect((await hedgey.plans('14')).start).to.eq(partialCheck.latestUnlock);
    now = BigNumber.from(await time.latest());
    let check = C.balanceAtTime(
      partialCheck.latestUnlock,
      cliff,
      partialCheck.remainder,
      rate,
      period,
      now.add(1),
      now.add(1)
    );
    expect(await hedgey.connect(d).redeemPlans(['14']))
      .to.emit('PlanRedeemed')
      .withArgs('14', check.balance, check.remainder, check.latestUnlock);
    expect(await dai.balanceOf(d.address)).to.eq(check.balance.add(partialCheck.balance));
    expect((await hedgey.plans('14')).amount).to.eq(check.remainder);
    expect((await hedgey.plans('14')).start).to.eq(check.latestUnlock);
    await time.increase(end.sub(now));
    expect(await hedgey.connect(d).redeemAllPlans())
      .to.emit('PlanRedeemed')
      .withArgs('14', check.remainder, 0, end);
    expect(await dai.balanceOf(d.address)).to.eq(amount);
  });
  it('transfers a plan and new owner redeems', async () => {
    let now = await time.latest();
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(d.address, dai.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(d.address, dai.address, amount, start, cliff, rate, period);
    await time.increase(params.cliff.add(period));
    vesting
      ? await hedgey.transferFrom(d.address, c.address, '15')
      : await hedgey.connect(d).transferFrom(d.address, c.address, '15');
    now = BigNumber.from(await time.latest());
    let check = C.balanceAtTime(start, cliff, amount, rate, period, now.add(1), now.add(1));
    expect(await hedgey.connect(c).redeemPlans(['15']))
      .to.emit('PlanRedeemed')
      .withArgs('15', check.balance, check.remainder, check.latestUnlock);
    expect(await dai.balanceOf(c.address)).to.eq(check.balance);
    expect(await hedgey.ownerOf('15')).to.eq(c.address);
    expect((await hedgey.plans('15')).amount).to.eq(check.remainder);
    expect((await hedgey.plans('15')).start).to.eq(check.latestUnlock);
  });
};

const redeemSegmentCombineTests = (voting, params) => {
  let s, admin, a, b, c, d, hedgey, token, dai, usdc, batcher;
  let amount, start, cliff, period, rate, end;
  it('redeems partial and normal on segmented plans', async () => {
    s = await setup();
    if (voting) hedgey = s.voteLocked;
    else hedgey = s.locked;
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    d = s.d;
    token = s.token;
    dai = s.dai;
    await token.approve(hedgey.address, C.E18_1000000.mul(10000));
    await dai.approve(hedgey.address, C.E18_1000000.mul(10000));
    let now = await time.latest();
    amount = params.amount;
    segment = amount.div(2);
    period = params.period;
    rate = params.rate;
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    await hedgey.connect(a).segmentPlan('1', [segment]);
    let plan1 = await hedgey.plans('1')
    let plan2 = await hedgey.plans('2');
    expect(plan1.amount.add(plan2.amount)).to.eq(amount);
    await time.increaseTo(cliff.add(C.bigMax(period, 100)));
    now = BigNumber.from(await time.latest());
    await hedgey.connect(a).partialRedeemPlans(['1', '2'], cliff);
    await hedgey.connect(a).combinePlans('1', '2');
    await time.increase(end.sub(now).add(period));
    expect(await hedgey.connect(a).redeemAllPlans()).to.emit('PlanRedeemed');
    expect(await token.balanceOf(a.address)).to.eq(amount);
  });
  it('redeems partial and normal on combined plans', async () => {
    let now = await time.latest();
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    await hedgey.createPlan(b.address, token.address, amount, start, cliff, rate, period);
    await hedgey.createPlan(b.address, token.address, amount, start, cliff, rate, period);
    await hedgey.connect(b).combinePlans('3', '4');
    await time.increaseTo(cliff.add(C.bigMax(period, 100)));
    now = BigNumber.from(await time.latest());
    await hedgey.connect(b).partialRedeemPlans(['3'], cliff);
    now = await time.increase(end.sub(now).add(period));
    await hedgey.connect(b).redeemAllPlans();
    expect(await token.balanceOf(b.address)).to.eq(amount.mul(2));
    expect((await hedgey.plans('3')).amount).to.eq(0);
  });
};

const redeemVotingVaultTests = (vesting, params) => {
  let s, admin, a, b, c, d, hedgey, token, dai;
  let amount, start, cliff, period, rate, end;
  it('redeems a plan with a voting vault setup', async () => {
    s = await setup();
    if (vesting) hedgey = s.voteVest;
    else hedgey = s.voteLocked;
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    d = s.d;
    token = s.token;
    dai = s.dai;
    await token.approve(hedgey.address, C.E18_1000000.mul(10000));
    await dai.approve(hedgey.address, C.E18_1000000.mul(10000));
    let now = await time.latest();
    amount = params.amount;
    period = params.period;
    rate = params.rate;
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    let tx = await hedgey.connect(a).setupVoting('1');
    const votingVault = (await tx.wait()).events[3].args.vaultAddress;
    expect(await token.balanceOf(votingVault)).to.eq(amount);
    expect(await token.balanceOf(hedgey.address)).to.eq(0);
    await time.increaseTo(cliff.add(C.bigMax(period, 100)));
    now = BigNumber.from(await time.latest());
    let check = C.balanceAtTime(start, cliff, amount, rate, period, now, cliff);
    expect(await hedgey.connect(a).partialRedeemPlans(['1'], cliff)).to.emit('PlanRedeemed').withArgs('1', check.balance, check.remainder, check.latestUnlock);
    expect(await token.balanceOf(votingVault)).to.eq(check.remainder);
    expect(await token.balanceOf(hedgey.address)).to.eq(0);
    expect(await token.balanceOf(a.address)).to.eq(check.balance);
    await time.increase(end.sub(now).add(period));
    now = BigNumber.from(await time.latest());
    await hedgey.connect(a).redeemPlans(['1']);
    expect(await token.balanceOf(votingVault)).to.eq(0);
    expect(await token.balanceOf(hedgey.address)).to.eq(0);
    expect(await token.balanceOf(a.address)).to.eq(amount);
  });
  it('transfers a plan with a voting vault, and new owner redeems the plan', async () => {
    let now = await time.latest();
    amount = params.amount;
    period = params.period;
    rate = params.rate;
    start = BigNumber.from(now).add(params.start);
    cliff = BigNumber.from(start).add(params.cliff);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    let tx = await hedgey.connect(a).setupVoting('2');
    const votingVault = (await tx.wait()).events[3].args.vaultAddress;
    expect(await token.balanceOf(votingVault)).to.eq(amount);
    expect(await token.balanceOf(hedgey.address)).to.eq(0);
    vesting 
      ? await hedgey.transferFrom(a.address, b.address, '2')
      : await hedgey.connect(a).transferFrom(a.address, b.address, '2');
    await time.increaseTo(cliff.add(C.bigMax(period, 100)));
    now = BigNumber.from(await time.latest());
    let check = C.balanceAtTime(start, cliff, amount, rate, period, now, cliff);
    await expect(hedgey.connect(a).partialRedeemPlans(['2'], cliff)).to.be.revertedWith('!owner');
    expect(await hedgey.connect(b).partialRedeemPlans(['2'], cliff)).to.emit('PlanRedeemed').withArgs('2', check.balance, check.remainder, check.latestUnlock);
    expect(await token.balanceOf(votingVault)).to.eq(check.remainder);
    expect(await token.balanceOf(hedgey.address)).to.eq(0);
    expect(await token.balanceOf(b.address)).to.eq(check.balance);
    await time.increase(end.sub(now).add(period));
    now = BigNumber.from(await time.latest());
    await hedgey.connect(b).redeemPlans(['2']);
    expect(await token.balanceOf(votingVault)).to.eq(0);
    expect(await token.balanceOf(hedgey.address)).to.eq(0);
    expect(await token.balanceOf(b.address)).to.eq(amount);
  });
};

const redeemErrorTests = (vesting, voting) => {
  let s, admin, a, b, c, d, hedgey, token;
  let amount, start, cliff, period, rate, end;
  it('reverts if the redeemer is not the owner of the plan', async () => {
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
    dai = s.dai;
    usdc = s.usdc;
    batcher = s.batcher;
    await token.approve(batcher.address, C.E18_1000000);
    await token.approve(hedgey.address, C.E18_1000000);
    await dai.approve(hedgey.address, C.E18_1000000);
    let now = await time.latest();
    start = now;
    cliff = BigNumber.from(start).add(C.DAY);
    period = C.DAY;
    rate = C.E18_10;
    amount = C.E18_10000;
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    await time.increase(cliff.sub(now).add(period));
    await expect(hedgey.connect(b).redeemPlans(['1'])).to.be.revertedWith('!owner');
  });
  it('it is skipped if the redemption time is before the start, and nothing redeemed', async () => {
    let now = await time.latest();
    start = C.DAY.add(now);
    cliff = BigNumber.from(start).add(C.DAY);
    period = C.DAY;
    vesting
      ? await hedgey.createPlan(a.address, dai.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, dai.address, amount, start, cliff, rate, period);
    // should skip redeeming 2, to check lets check balances before and after
    let plan2 = await hedgey.plans('2');
    const amt = plan2.amount;
    const start2 = plan2.start;
    await hedgey.connect(a).redeemPlans(['1', '2']);
    // expect that plan 2 is the same as before and has not been redeemed
    let _plan2 = await hedgey.plans('2');
    expect(plan2.amount).to.eq(_plan2.amount);
    expect(plan2.start).to.eq(_plan2.start);
    expect(plan2.rate).to.eq(_plan2.rate);
    expect(plan2.period).to.eq(_plan2.period);
  });
  it('is skipped if the redemption time is before the cliff', async () => {
    let now = await time.latest();
    await time.increase(start.sub(now).add(1));
    let plan2 = await hedgey.plans('2');
    const amt = plan2.amount;
    const start2 = plan2.start;
    await hedgey.connect(a).redeemPlans(['1', '2']);
    expect(await dai.balanceOf(a.address)).to.eq(0);
    expect(await dai.balanceOf(hedgey.address)).to.eq(amount);
    let _plan2 = await hedgey.plans('2');
    expect(_plan2.amount).to.eq(amt);
    expect(_plan2.start).to.eq(start2);
    
  });
  it('partial reverts if the redemption time requested is in the futre', async () => {
    let now = BigNumber.from(await time.latest());
    await expect(hedgey.connect(a).partialRedeemPlans(['1'], now.add(1))).to.be.revertedWith('!future');
  });
  it('reverts if the plan has already been fully redeemed', async () => {
    let now = BigNumber.from(await time.latest());
    await time.increase(end.sub(now))
    await hedgey.connect(a).redeemPlans(['1']);
    await expect(hedgey.connect(a).redeemPlans(['1'])).to.be.reverted;
  });
};

module.exports = {
  redeemTests,
  redeemSegmentCombineTests,
  redeemVotingVaultTests,
  redeemErrorTests,
};
