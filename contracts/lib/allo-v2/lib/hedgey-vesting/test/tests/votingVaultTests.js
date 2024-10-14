const { expect } = require('chai');
const setup = require('../fixtures');
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const C = require('../constants');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

const votingVaultTests = (vesting, params) => {
  let s, admin, a, b, c, d, hedgey, token, dai, usdc;
  let amount, start, cliff, period, rate, end;
  it('creates a plan and the holder creates a voting vault', async () => {
    s = await setup();
    hedgey = vesting ? s.voteVest : s.voteLocked;
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    d = s.d;
    token = s.token;
    dai = s.dai;
    usdc = s.usdc;
    await token.approve(hedgey.address, C.E18_1000000.mul(10000));
    await dai.approve(hedgey.address, C.E18_1000000.mul(10000));
    await usdc.approve(hedgey.address, C.E18_1000000.mul(10000));
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
    let tx = await hedgey.connect(a).setupVoting('1');
    const votingVault = (await tx.wait()).events[3].args.vaultAddress;
    expect(await hedgey.votingVaults('1')).to.eq(votingVault);
    expect(await token.balanceOf(votingVault)).to.eq(amount);
    expect(await token.delegates(votingVault)).to.eq(a.address);
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount);
  });
  it('delegates the tokens in a plan to another wallet', async () => {
    const votingVault = await hedgey.votingVaults('1');
    await hedgey.connect(a).delegate('1', b.address);
    expect(await token.balanceOf(votingVault)).to.eq(amount);
    expect(await token.delegates(votingVault)).to.eq(b.address);
  });
  it('pre-delegates tokens to a wallet, then when recieves a plan it auto delegates when setup voting', async () => {
    await token.connect(a).delegate(d.address);
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    let tx = await hedgey.connect(a).setupVoting('2');
    const votingVault = (await tx.wait()).events[3].args.vaultAddress;
    expect(await hedgey.votingVaults('2')).to.eq(votingVault);
    expect(await token.balanceOf(votingVault)).to.eq(amount);
    expect(await token.delegates(votingVault)).to.eq(d.address);
    // make sure it doesn't impact oriringal other plan
    const vv1 = await hedgey.votingVaults('1');
    expect(await token.delegates(vv1)).to.eq(b.address);
  });
  it('transfers a plan, the original wallet is still delegate and then new wallet self delegates', async () => {
    // transfer token 2 to c wallet
    vesting 
      ? await hedgey.transferFrom(a.address, c.address, '2')
      : await hedgey.connect(a).transferFrom(a.address, c.address, '2');
    const vv = await hedgey.votingVaults('2');
    expect(await token.delegates(vv)).to.eq(d.address);
    await expect(hedgey.connect(d).delegate('2', c.address)).to.be.revertedWith('!delegator');
    await expect(hedgey.connect(a).delegate('2', c.address)).to.be.revertedWith('!delegator');
    expect(await token.delegates(vv)).to.eq(d.address);
    await hedgey.connect(c).delegate('2', c.address);
    expect(await token.delegates(vv)).to.eq(c.address);
  });
  it('delegates tokens without a voting vault and vault is automatically setup', async () => {
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    //token 3
    await hedgey.connect(a).delegate('3', d.address);
    const vv = await hedgey.votingVaults('3');
    expect(await token.delegates(vv)).to.eq(d.address);
    expect(await token.balanceOf(vv)).to.eq(amount);
  });
  it('delegates multiple plans to various delegatees', async () => {
    //create tokens 4, 5, 6, 7, 8
    for (let i = 0; i < 5; i++) {
      vesting
        ? await hedgey.createPlan(a.address, dai.address, amount, start, cliff, rate, period, admin.address, true)
        : await hedgey.createPlan(a.address, dai.address, amount, start, cliff, rate, period);
    }
    await hedgey
      .connect(a)
      .delegatePlans(['4', '5', '6', '7', '8'], [admin.address, b.address, c.address, c.address, d.address]);
    expect(await dai.delegates(await hedgey.votingVaults('4'))).to.eq(admin.address);
    expect(await dai.delegates(await hedgey.votingVaults('5'))).to.eq(b.address);
    expect(await dai.delegates(await hedgey.votingVaults('6'))).to.eq(c.address);
    expect(await dai.delegates(await hedgey.votingVaults('7'))).to.eq(c.address);
    expect(await dai.delegates(await hedgey.votingVaults('8'))).to.eq(d.address);
  });
  it('delegates all of the owned plans to a single delegatee', async () => {
    // tokens 9 10 11
    for (let i = 0; i < 3; i++) {
      vesting
        ? await hedgey.createPlan(c.address, usdc.address, amount, start, cliff, rate, period, admin.address, true)
        : await hedgey.createPlan(c.address, usdc.address, amount, start, cliff, rate, period);
    }
    await hedgey.connect(c).delegateAll(usdc.address, d.address);
    expect(await usdc.delegates(await hedgey.votingVaults('9'))).to.eq(d.address);
    expect(await usdc.delegates(await hedgey.votingVaults('10'))).to.eq(d.address);
    expect(await usdc.delegates(await hedgey.votingVaults('11'))).to.eq(d.address);
  });
    it('segements and delegates voting vault with no voting vault setup for original plan', async () => {
        let _s = await setup();
        let locked = _s.voteLocked;
        await token.approve(locked.address, C.E18_1000000.mul(10000));
        await locked.createPlan(a.address, token.address, amount, start, cliff, rate, period);
        expect(await token.balanceOf(locked.address)).to.eq(amount);
        let segment = amount.div(2);
        await locked.connect(a).segmentAndDelegatePlans('1', [segment], [c.address]);
        expect(await locked.votingVaults('1')).to.eq(C.ZERO_ADDRESS);
        expect(await token.balanceOf(locked.address)).to.eq(amount.sub(segment));
        let vv = await locked.votingVaults('2');
        expect(await token.balanceOf(vv)).to.eq(segment);
        expect(await token.delegates(vv)).to.eq(c.address);

    });
    it('segments and delegates voting vault with an original voting vault setup', async () => {
        let _s = await setup();
        let locked = _s.voteLocked;
        await token.approve(locked.address, C.E18_1000000.mul(10000));
        await locked.createPlan(a.address, token.address, amount, start, cliff, rate, period);
        expect(await token.balanceOf(locked.address)).to.eq(amount);
        await locked.connect(a).setupVoting('1');
        expect(await token.balanceOf(locked.address)).to.eq(0);
        const vv1 = await locked.votingVaults('1');
        expect(await token.balanceOf(vv1)).to.eq(amount);
        let segment = amount.div(2);
        await locked.connect(a).delegate('1', a.address);
        await locked.connect(a).segmentAndDelegatePlans('1', [segment], [c.address]);
        expect(await token.balanceOf(vv1)).to.eq(amount.sub(segment));
        expect(await token.delegates(vv1)).to.eq(a.address);
        expect(await token.balanceOf(locked.address)).to.eq(0);
        let vv = await locked.votingVaults('2');
        expect(await token.balanceOf(vv)).to.eq(segment);
        expect(await token.delegates(vv)).to.eq(c.address);
    })
    it('combines two plans, the first with a vault and the second without and delegates the tokens', async () => {
        let _s = await setup();
        let locked = _s.voteLocked;
        await token.approve(locked.address, C.E18_1000000.mul(10000));
        await locked.createPlan(a.address, token.address, amount, start, cliff, rate, period);
        await locked.createPlan(a.address, token.address, amount, start, cliff, rate, period);
        const end = C.planEnd(start, amount, rate, period);
        await locked.connect(a).setupVoting('1');
        const vv = await locked.votingVaults('1');
        expect(await token.balanceOf(vv)).to.eq(amount);
        await locked.connect(a).combinePlans('1', '2');
        expect(await token.balanceOf(vv)).to.eq(amount.mul(2));
        expect((await locked.plans('2')).amount).to.eq(0);
        expect((await locked.plans('2')).rate).to.eq(0);
        expect((await locked.plans('2')).start).to.eq(0);
        expect((await locked.plans('2')).period).to.eq(0);
        expect((await locked.plans('2')).cliff).to.eq(0);
        expect((await locked.plans('1')).amount).to.eq(amount.mul(2));
        expect((await locked.plans('1')).start).to.eq(start);
        expect((await locked.plans('1')).cliff).to.eq(cliff);
        expect((await locked.plans('1')).period).to.eq(period);
        const calcRate = C.calcCombinedRate(amount, amount, rate, rate, start, end, period);
        expect((await locked.plans('1')).rate).to.eq(calcRate);
        expect((await locked.planEnd('1'))).to.eq(end);
        await locked.connect(a).delegate('1', b.address);
        expect(await token.delegates(vv)).to.eq(b.address);
    });
    it('combines two plans, the first without a vault and the second with a vault and delegates the tokens', async () => {
        // expecting survivor to be 2
        let _s = await setup();
        let locked = _s.voteLocked;
        await token.approve(locked.address, C.E18_1000000.mul(10000));
        await locked.createPlan(a.address, token.address, amount, start, cliff, rate, period);
        await locked.createPlan(a.address, token.address, amount, start, cliff, rate, period);
        const end = C.planEnd(start, amount, rate, period);
        await locked.connect(a).setupVoting('2');
        const vv = await locked.votingVaults('2');
        expect(await token.balanceOf(vv)).to.eq(amount);
        await locked.connect(a).combinePlans('1', '2');
        expect(await token.balanceOf(vv)).to.eq(amount.mul(2));
        expect((await locked.plans('1')).amount).to.eq(0);
        expect((await locked.plans('1')).rate).to.eq(0);
        expect((await locked.plans('1')).start).to.eq(0);
        expect((await locked.plans('1')).period).to.eq(0);
        expect((await locked.plans('1')).cliff).to.eq(0);
        expect((await locked.plans('2')).amount).to.eq(amount.mul(2));
        expect((await locked.plans('2')).start).to.eq(start);
        expect((await locked.plans('2')).cliff).to.eq(cliff);
        expect((await locked.plans('2')).period).to.eq(period);
        const calcRate = C.calcCombinedRate(amount, amount, rate, rate, start, end, period);
        expect((await locked.plans('2')).rate).to.eq(calcRate);
        expect((await locked.planEnd('2'))).to.eq(end);
        await locked.connect(a).delegate('2', b.address);
        expect(await token.delegates(vv)).to.eq(b.address);
    })
    it('combines two plans with a vault and delegates the tokens', async () => {
        //expecting survivor to be 1
        let _s = await setup();
        let locked = _s.voteLocked;
        await token.approve(locked.address, C.E18_1000000.mul(10000));
        await locked.createPlan(a.address, token.address, amount, start, cliff, rate, period);
        await locked.createPlan(a.address, token.address, amount, start, cliff, rate, period);
        const end = C.planEnd(start, amount, rate, period);
        await locked.connect(a).setupVoting('1');
        await locked.connect(a).setupVoting('2');
        const vv = await locked.votingVaults('1');
        const vv2 = await locked.votingVaults('2');
        expect(await token.balanceOf(vv)).to.eq(amount);
        expect(await token.balanceOf(vv2)).to.eq(amount);
        await locked.connect(a).combinePlans('1', '2');
        expect(await token.balanceOf(vv)).to.eq(amount.mul(2));
        expect(await token.balanceOf(vv2)).to.eq(0);
        expect((await locked.plans('2')).amount).to.eq(0);
        expect((await locked.plans('2')).rate).to.eq(0);
        expect((await locked.plans('2')).start).to.eq(0);
        expect((await locked.plans('2')).period).to.eq(0);
        expect((await locked.plans('2')).cliff).to.eq(0);
        expect((await locked.plans('1')).amount).to.eq(amount.mul(2));
        const calcRate = C.calcCombinedRate(amount, amount, rate, rate, start, end, period);
        expect((await locked.plans('1')).rate).to.eq(calcRate);
        expect((await locked.planEnd('1'))).to.eq(end);
        expect((await locked.plans('1')).start).to.eq(start);
        expect((await locked.plans('1')).cliff).to.eq(cliff);
        expect((await locked.plans('1')).period).to.eq(period);
        await locked.connect(a).delegate('1', b.address);
        expect(await token.delegates(vv)).to.eq(b.address);
    })
};

const votingVaultDelegatorTests = (vesting, params) => {
  let s, admin, a, b, c, d, hedgey, token, dai, usdc;
  let amount, start, cliff, period, rate, end;
  it('creates a plan and the holder creates a voting vault, then approves wallet B to redelegate the tokens', async () => {
    s = await setup();
    hedgey = vesting ? s.voteVest : s.voteLocked;
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    d = s.d;
    token = s.token;
    dai = s.dai;
    usdc = s.usdc;
    await token.approve(hedgey.address, C.E18_1000000.mul(10000));
    await dai.approve(hedgey.address, C.E18_1000000.mul(10000));
    await usdc.approve(hedgey.address, C.E18_1000000.mul(10000));
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
    let tx = await hedgey.connect(a).setupVoting('1');
    const votingVault = (await tx.wait()).events[3].args.vaultAddress;
    expect(await hedgey.votingVaults('1')).to.eq(votingVault);
    expect(await token.balanceOf(votingVault)).to.eq(amount);
    expect(await token.delegates(votingVault)).to.eq(a.address);
    expect(await hedgey.lockedBalances(a.address, token.address)).to.eq(amount);
    expect(await token.delegates(votingVault)).to.eq(a.address);
    expect(await hedgey.connect(a).approveDelegator(b.address, 1)).to.emit('DelegatorApproved').withArgs(a.address, b.address, 1);
    expect(await hedgey.connect(b).delegate(1, b.address)).to.emit('DelegateChanged').withArgs(votingVault, a.address, b.address);
    expect(await token.delegates(votingVault)).to.eq(b.address);
  });
  it('wallet A approves an operator with wallet C, who redelegates the tokens', async () => {
    const votingVault = await hedgey.votingVaults(1)
    expect(await hedgey.connect(a).setApprovalForAllDelegation(c.address, true)).to.emit('ApprovalForAllDelegation').withArgs(a.address, c.address, true);
    expect(await hedgey.connect(c).approveDelegator(C.ZERO_ADDRESS, 1)).to.emit('DelegatorApproved').withArgs(a.address, C.ZERO_ADDRESS, 1);
    await expect(hedgey.connect(b).delegate(1, c.address)).to.be.revertedWith('!delegator');
    expect(await hedgey.connect(a).delegate(1, a.address)).to.emit('DelegateChanged').withArgs(votingVault, b.address, a.address);
    expect(await token.delegates(votingVault)).to.eq(a.address);
    expect(await hedgey.connect(c).delegate(1, c.address)).to.emit('DelegateChanged').withArgs(votingVault, a.address, c.address);
    expect(await token.delegates(votingVault)).to.eq(c.address);
    expect(await hedgey.isApprovedForAllDelegation(a.address, c.address)).to.eq(true);
  });
  it('wallet C acts as approver to approve wallet D as a delegator', async () => {
    const votingVault = await hedgey.votingVaults(1)
    expect(await hedgey.connect(c).approveDelegator(d.address, 1)).to.emit('DelegatorApproved').withArgs(a.address, d.address, 1);
    expect(await hedgey.getApprovedDelegator(1)).to.eq(d.address);
    expect(await hedgey.connect(d).delegate(1, d.address)).to.emit('DelegateChanged').withArgs(votingVault, c.address, d.address);
  });
  it('mints another token to wallet A and C can as operator delegate both plans', async () => {
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    await hedgey.connect(c).delegatePlans(['1', '2'], [c.address, b.address]);
    const vv1 = await hedgey.votingVaults(1);
    const vv2 = await hedgey.votingVaults(2);
    expect(await token.delegates(vv1)).to.eq(c.address);
    expect(await token.delegates(vv2)).to.eq(b.address);
  });
  it('delegate approved is removed when token is transferred', async () => {
    await hedgey.connect(a).approveDelegator(b.address, '2');
    expect(await hedgey.getApprovedDelegator(2)).to.eq(b.address);
    vesting
      ? await hedgey.connect(admin).transferFrom(a.address, c.address, '2')
      : await hedgey.connect(a).transferFrom(a.address, c.address, 2);
    expect(await hedgey.getApprovedDelegator(2)).to.eq(C.ZERO_ADDRESS);
    await expect(hedgey.connect(b).delegate(2, b.address)).to.be.revertedWith('!delegator');
  });
}

const votingVaultErrorTests = (vesting) => {
  let s, admin, a, b, c, d, hedgey, token, dai, usdc;
  let amount, start, cliff, period, rate, end;
  it('reverts if the function caller is not the owner of the plan', async () => {
    s = await setup();
    hedgey = vesting ? s.voteVest : s.voteLocked;
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    d = s.d;
    token = s.token;
    dai = s.dai;
    usdc = s.usdc;
    await token.approve(hedgey.address, C.E18_1000000);
    await dai.approve(hedgey.address, C.E18_1000000);
    await usdc.approve(hedgey.address, C.E18_1000000);
    let now = BigNumber.from(await time.latest());
    amount = C.E18_1000;
    period = C.DAY;
    rate = C.E18_1;
    start = now;
    cliff = start.add(C.DAY);
    end = C.planEnd(start, amount, rate, period);
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    await expect(hedgey.connect(b).setupVoting('1')).to.be.revertedWith('!delegator');
    await expect(hedgey.connect(b).delegate('1', b.address)).to.be.revertedWith('!delegator');
    await expect(hedgey.connect(b).delegatePlans(['1'], [b.address])).to.be.revertedWith('!delegator');
  });
  it('reverts if the plan holder already has a voting vault setup', async () => {
    await hedgey.connect(a).setupVoting('1');
    await expect(hedgey.connect(a).setupVoting('1')).to.be.revertedWith('exists');
  });
  it('reverts if the token isnt a governance token', async () => {
    let NonVote = await ethers.getContractFactory('NonVotingToken');
    let nonVote = await NonVote.deploy(C.E18_1000000, 'NV', 'NV');
    await nonVote.approve(hedgey.address, C.E18_1000000);
    vesting
      ? await hedgey.createPlan(a.address, nonVote.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, nonVote.address, amount, start, cliff, rate, period);
    await expect(hedgey.connect(a).setupVoting('2')).to.be.reverted;
  });
  it('reverts if the token calls a function with the delegate funtion to physically transfer tokens', async () => {
    let FakeToken = await ethers.getContractFactory('FakeToken');
    let fakeToken = await FakeToken.deploy(C.E18_10000, 'FT', 'FT');
    await fakeToken.approve(hedgey.address, C.E18_1000000);
    vesting
      ? await hedgey.createPlan(a.address, fakeToken.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, fakeToken.address, amount, start, cliff, rate, period);
    await expect(hedgey.connect(a).delegate('3', c.address)).to.be.revertedWith('balance error');
    await expect(hedgey.connect(a).delegatePlans(['3'], [c.address])).to.be.revertedWith('balance error');
    await expect(hedgey.connect(a).delegateAll(fakeToken.address, c.address)).to.be.revertedWith('balance error');
    let tx = await hedgey.connect(a).setupVoting('3');
    let vv = await hedgey.votingVaults('3');
    expect(vv).to.not.eq(C.ZERO_ADDRESS);
    expect(await fakeToken.balanceOf(vv)).to.eq(amount);
    await expect(hedgey.connect(a).delegate('3', c.address)).to.be.revertedWith('balance error');
  });
  it('reverts if delegating multiple plans the plan array lenght is different than the delegates array', async () => {
    vesting
      ? await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period, admin.address, true)
      : await hedgey.createPlan(a.address, token.address, amount, start, cliff, rate, period);
    await expect(hedgey.connect(a).delegatePlans(['4'], [a.address, b.address])).to.be.revertedWith('array error')
  });
};

module.exports = {
  votingVaultErrorTests,
  votingVaultTests,
  votingVaultDelegatorTests,
};
