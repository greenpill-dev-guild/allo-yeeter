const C = require('../constants');
const setup = require('../fixtures');
const { expect } = require('chai');
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const { createTree, getProof } = require('../merkleGenerator');
const { ethers } = require('hardhat');
const { v4: uuidv4, parse: uuidParse } = require('uuid');

const claimTests = (lockupType, voting, params) => {
  let s, admin, a, b, c, token, claimer, hedgey;
  let amount, amountA, amountB, campaign, lockup, vesting, donation;
  let id;
  it(`Deploys the contracts and creates a merkle tree, uploads the root to the claimer`, async () => {
    s = await setup();
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    token = s.token;
    claimer = s.claimer;
    vesting = lockupType == 2 ? true : false;
    if (vesting) {
      hedgey = voting ? s.voteVest : s.vest;
    } else {
      hedgey = voting ? s.voteLocked : s.locked;
    }
    let values = [];
    amount = C.ZERO;
    const uuid = uuidv4();
    id = uuidParse(uuid);
    for (let i = 0; i < params.totalRecipients; i++) {
      let wallet;
      let amt = C.randomBigNum(1000, 10);
      if (i == params.nodeA) {
        wallet = a.address;
        amountA = amt;
      } else if (i == params.nodeB) {
        wallet = b.address;
        amountB = amt;
      } else {
        wallet = ethers.Wallet.createRandom().address;
      }
      amount = amt.add(amount);
      values.push([wallet, amt]);
    }
    const root = createTree(values, ['address', 'uint256']);
    let now = await time.latest();
    let end = C.MONTH.add(now);
    campaign = {
      manager: admin.address,
      token: token.address,
      amount,
      end,
      tokenLockup: lockupType,
      root,
    };
    lockup = {
      tokenLocker: hedgey.address,
      rate: params.rate,
      start: params.start.add(now),
      cliff: params.cliff.add(params.start).add(now),
      period: params.period,
    };
    donation = {
      tokenLocker: hedgey.address,
      amount: 0,
      rate: 0,
      start: 0,
      cliff: 0,
      period: 0,
    };
    await token.approve(claimer.address, C.E18_1000000.mul(10000));
    let tx =
      lockupType == 0
        ? await claimer.createUnlockedCampaign(id, campaign, donation)
        : await claimer.createLockedCampaign(id, campaign, lockup, donation);
    expect(tx).to.emit('CaimpaignStarted').withArgs(id, campaign);
    if (lockupType > 0) {
      expect(tx).to.emit('ClaimLockupCreated').withArgs(id, lockup);
      let lock = await claimer.claimLockups(id);
      expect(lock.start).to.eq(lockup.start);
      expect(lock.rate).to.eq(lockup.rate);
      expect(lock.cliff).to.eq(lockup.cliff);
      expect(lock.period).to.eq(lockup.period);
    }
    expect(await token.balanceOf(claimer.address)).to.equal(amount);
  });
  it('Wallet A claims their tokens', async () => {
    let proof = getProof('./test/trees/tree.json', a.address);
    let tx = await claimer.connect(a).claimTokens(id, proof, amountA);
    expect(tx).to.emit('TokensClaimed').withArgs(id, a.address, amountA, amount.sub(amountA));
    if (lockupType > 0) {
      if (lockupType == 1)
        expect(tx)
          .to.emit('PlanCreated')
          .withArgs('1', a.address, token.address, amountA, lockup.start, lockup.cliff, lockup.rate, lockup.period);
      expect(await token.balanceOf(hedgey.address)).to.equal(amountA);
      expect(await hedgey.balanceOf(a.address)).to.equal(1);
      expect(await hedgey.ownerOf('1')).to.eq(a.address);
      const plan = await hedgey.plans('1');
      expect(plan.token).to.equal(token.address);
      expect(plan.amount).to.equal(amountA);
      expect(plan.start).to.equal(lockup.start);
      expect(plan.cliff).to.equal(lockup.cliff);
      expect(plan.period).to.equal(lockup.period);
      expect(plan.rate).to.equal(lockup.rate);
      if (vesting) {
        expect(tx)
          .to.emit('PlanCreated')
          .withArgs(
            '1',
            a.address,
            token.address,
            amountA,
            lockup.start,
            lockup.cliff,
            lockup.rate,
            lockup.period,
            campaign.manager,
            false
          );
        expect(plan.vestingAdmin).to.eq(campaign.manager);
        expect(plan.adminTransferOBO).to.eq(false);
      }
    } else {
      expect(await token.balanceOf(a.address)).to.equal(amountA);
    }
    expect(await token.balanceOf(claimer.address)).to.equal(amount.sub(amountA));
    let remainder = (await claimer.campaigns(id)).amount;
    expect(remainder).to.eq(amount.sub(amountA));
    expect(await claimer.claimed(id, a.address)).to.eq(true);
  });
  it('Wallet A cannot claim again', async () => {
    let proof = getProof('./test/trees/tree.json', a.address);
    await expect(claimer.connect(a).claimTokens(id, proof, amountA)).to.be.revertedWith('already claimed');
  });
  it('If Wallet B is part of the claim it will claim tokens, otherwise cannot claim', async () => {
    let proof = getProof('./test/trees/tree.json', b.address);
    if (proof.length > 0) {
      let tx = await claimer.connect(b).claimTokens(id, proof, amountB);
      expect(tx).to.emit('TokensClaimed').withArgs(id, b.address, amountB, amount.sub(amountA).sub(amountB));
      if (lockupType > 0) {
        if (lockupType == 1)
          expect(tx)
            .to.emit('PlanCreated')
            .withArgs('2', b.address, token.address, amountB, lockup.start, lockup.cliff, lockup.rate, lockup.period);
        expect(await token.balanceOf(hedgey.address)).to.equal(amountA.add(amountB));
        expect(await hedgey.balanceOf(b.address)).to.equal(1);
        expect(await hedgey.ownerOf('2')).to.eq(b.address);
        const plan = await hedgey.plans('2');
        expect(plan.token).to.equal(token.address);
        expect(plan.amount).to.equal(amountB);
        expect(plan.start).to.equal(lockup.start);
        expect(plan.cliff).to.equal(lockup.cliff);
        expect(plan.period).to.equal(lockup.period);
        expect(plan.rate).to.equal(lockup.rate);
        if (vesting) {
          expect(tx)
            .to.emit('PlanCreated')
            .withArgs(
              '2',
              b.address,
              token.address,
              amountB,
              lockup.start,
              lockup.cliff,
              lockup.rate,
              lockup.period,
              campaign.manager,
              false
            );
          expect(plan.vestingAdmin).to.eq(campaign.manager);
          expect(plan.adminTransferOBO).to.eq(false);
        }
      } else {
        expect(await token.balanceOf(b.address)).to.equal(amountB);
      }
      expect(await token.balanceOf(claimer.address)).to.equal(amount.sub(amountA).sub(amountB));
      let remainder = (await claimer.campaigns(id)).amount;
      expect(remainder).to.eq(amount.sub(amountA).sub(amountB));
      expect(await claimer.claimed(id, b.address)).to.eq(true);
    } else {
      let fakeProof = getProof('./test/trees/tree.json', a.address);
      await expect(claimer.connect(b).claimTokens(id, fakeProof, amountB)).to.be.reverted;
    }
  });
  it('owner cancels the claim', async () => {
    let tx = await claimer.cancelCampaign(id);
    expect(tx).to.emit('CampaignCancelled').withArgs(id);
    expect(await token.balanceOf(claimer.address)).to.equal(C.ZERO);
  });
  it('creates a claim campaign with a donation', async () => {
    amount = C.ZERO;
    let values = [];
    const uuid = uuidv4();
    id = uuidParse(uuid);
    for (let i = 0; i < params.totalRecipients; i++) {
      let amt = C.randomBigNum(1000, 10);
      let wallet = ethers.Wallet.createRandom().address;
      amount = amt.add(amount);
      values.push([wallet, amt]);
    }
    const root = createTree(values, ['address', 'uint256']);
    let now = await time.latest();
    let end = C.MONTH.add(now);
    campaign = {
      manager: admin.address,
      token: token.address,
      amount,
      end,
      tokenLockup: lockupType,
      root,
    };
    lockup = {
      tokenLocker: hedgey.address,
      rate: params.rate,
      start: params.start.add(now),
      cliff: params.cliff.add(params.start).add(now),
      period: params.period,
    };
    let donationLocker = voting ? s.voteLocked : s.locked;
    donation = {
      tokenLocker: donationLocker.address,
      amount: C.E18_100,
      rate: C.E18_1,
      start: now,
      cliff: C.DAY.add(now),
      period: C.DAY,
    };
    await token.approve(claimer.address, C.E18_1000000.mul(10000));
    let tx =
      lockupType == 0
        ? await claimer.createUnlockedCampaign(id, campaign, donation)
        : await claimer.createLockedCampaign(id, campaign, lockup, donation);
    expect(tx).to.emit('CaimpaignStarted').withArgs(id, campaign);

    expect(await donationLocker.balanceOf(c.address)).to.eq(1);
    const donationPlanId = await donationLocker.tokenOfOwnerByIndex(c.address, 0);
    const donationPlan = await donationLocker.plans(donationPlanId);
    expect(donationPlan.token).to.eq(campaign.token);
    expect(donationPlan.amount).to.eq(donation.amount);
    expect(donationPlan.start).to.eq(donation.start);
    expect(donationPlan.rate).to.eq(donation.rate);
    expect(donationPlan.cliff).to.eq(donation.cliff);
    expect(donationPlan.period).to.eq(donation.period);
    donation.start = 0;
    const newId = uuidv4();
    id = uuidParse(newId);
    tx =
      lockupType == 0
        ? await claimer.createUnlockedCampaign(id, campaign, donation)
        : await claimer.createLockedCampaign(id, campaign, lockup, donation);
    expect(tx).to.emit('CaimpaignStarted').withArgs(id, campaign);
    expect(await token.balanceOf(c.address)).to.eq(donation.amount);
  });
};

const claimErrorTests = () => {
  let admin, a, b, c, token, claimer, hedgey;
  let amount, campaign, lockup, donation;
  let id, altId;
  it('create revert if the Id is already used', async () => {
    const s = await setup();
    admin = s.admin;
    a = s.a;
    b = s.b;
    c = s.c;
    token = s.token;
    claimer = s.claimer;
    hedgey = s.locked;
    let values = [];
    amount = C.ZERO;
    const uuid = uuidv4();
    id = uuidParse(uuid);
    let amt;
    let wallet;
    for (let i = 0; i < 10; i++) {
      if (i == 1) {
        amt = C.E18_100;
        wallet = a.address;
      } else if (i == 2) {
        amt = C.E18_50;
        wallet = b.address;
      } else if (i == 3) {
        amt = C.E18_500;
        wallet = c.address;
      } else {
        amt = C.randomBigNum(100, 10);
        wallet = ethers.Wallet.createRandom().address;
      }
      values.push([wallet, amt]);
    }
    const root = createTree(values, ['address', 'uint256']);
    let now = await time.latest();
    let end = C.DAY.add(now);
    campaign = {
      manager: admin.address,
      token: token.address,
      amount: C.E18_200,
      end,
      tokenLockup: '1',
      root,
    };
    lockup = {
      tokenLocker: hedgey.address,
      rate: C.E18_05,
      start: now,
      cliff: now,
      period: C.DAY,
    };
    donation = {
      tokenLocker: hedgey.address,
      amount: C.ZERO,
      rate: C.ZERO,
      start: 0,
      cliff: 0,
      period: 0,
    };
    await token.approve(claimer.address, C.E18_1000000.mul(10000));
    await claimer.createLockedCampaign(id, campaign, lockup, donation);
    await expect(claimer.createLockedCampaign(id, campaign, lockup, donation)).to.be.revertedWith('in use');
    await expect(claimer.createUnlockedCampaign(id, campaign, donation)).to.be.revertedWith('in use');
  });
  it('create will revert if the token address is 0', async () => {
    campaign.token = C.ZERO_ADDRESS;
    const uuid = uuidv4();
    altId = uuidParse(uuid);
    await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('0_address');
  });
  it('create will revert if the manager is 0 address', async () => {
    campaign.token = token.address;
    campaign.manager = C.ZERO_ADDRESS;
    await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('0_manager');
  });
  it('create will revert of the amount is 0', async () => {
    campaign.manager = admin.address;
    campaign.amount = C.ZERO;
    await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('0_amount');
  });
  it('create will revert of the end date is in the past', async () => {
    campaign.amount = C.E18_1000;
    let now = await time.latest();
    campaign.end = now - 1;
    await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('end error');
  });
  it('create will revert for lockups if the end is invalid', async () => {
    let now = await time.latest();
    campaign.end = C.WEEK.add(now);
    lockup.tokenLocker = C.ZERO_ADDRESS;
    await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('invalide locker');
    lockup.tokenLocker = hedgey.address;
    lockup.rate = C.ZERO;
    await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('0_rate');
    lockup.rate = C.E18_05;
    lockup.cliff = C.WEEK.mul(1000000).add(now);
    await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('cliff > end');
    lockup.cliff = now;
    lockup.period = C.ZERO;
    await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('0_period');
  });
  'it create locked will revert if the campaign has the unlocked enum',
    async () => {
      campaign.tokenLockup = '0';
      await expect(claimer.createLockedCampaign(altId, campaign, lockup, donation)).to.be.revertedWith('!locked');
    };
  it('create unlocked will revert if the campaign has the locked enum', async () => {
    campaign.tokenLockup = '1';
    await expect(claimer.createUnlockedCampaign(altId, campaign, donation)).to.be.revertedWith('locked');
  });
  it('claim will revert if the proof is invalid', async () => {
    let proof = getProof('./test/trees/tree.json', b.address);
    await expect(claimer.connect(a).claimTokens(id, proof, C.E18_100)).to.be.revertedWith('Invalid proof');
  });
  it('claim will revert if the user isnt allowed to claim', async () => {
    let proof = getProof('./test/trees/tree.json', a.address);
    await expect(claimer.connect(c).claimTokens(id, proof, C.E18_100)).to.be.revertedWith('Invalid proof');
  });
  it('claim will revert if the amount to be claimed is wrong', async () => {
    let proof = getProof('./test/trees/tree.json', a.address);
    await expect(claimer.connect(a).claimTokens(id, proof, C.E18_10)).to.be.revertedWith('Invalid proof');
  });
  it('claim will revert if the id provided is not an id', async () => {
    let proof = getProof('./test/trees/tree.json', a.address);
    let badId = uuidv4();
    badId = uuidParse(badId);
    await expect(claimer.connect(a).claimTokens(badId, proof, C.E18_100)).to.be.revertedWith('campaign ended');
  });
  it('claim will revert if the user has already claimed', async () => {
    let proof = getProof('./test/trees/tree.json', a.address);
    await claimer.connect(a).claimTokens(id, proof, C.E18_100);
    await expect(claimer.connect(a).claimTokens(id, proof, C.E18_100)).to.be.revertedWith('already claimed');
  });
  it('claim will revert if the campaign is under funded', async () => {
    let proof = getProof('./test/trees/tree.json', c.address);
    await expect(claimer.connect(c).claimTokens(id, proof, C.E18_500)).to.be.revertedWith('campaign unfunded');
  });
  it('claim will revert if the end date has already passed', async () => {
    await time.increaseTo(campaign.end.add(20));
    let proof = getProof('./test/trees/tree.json', b.address);
    await expect(claimer.connect(b).claimTokens(id, proof, C.E18_50)).to.be.revertedWith('campaign ended');
  });
  it('cancel will revert if it is not the manager claiming', async () => {
    await expect(claimer.connect(a).cancelCampaign(id)).to.be.revertedWith('!manager');
  });
  it('claim will revert if the campaign has already been cancelled or completed', async () => {
    let values = [
      [a.address, C.E18_100],
      [b.address, C.E18_1000],
    ];
    let newRoot = createTree(values, ['address', 'uint256']);
    campaign.root = newRoot;
    campaign.amount = C.E18_1000.add(C.E18_100);
    lockup.period = C.DAY;
    let now = await time.latest();
    campaign.end = C.DAY.add(now);
    let uuid = uuidv4();
    altId = uuidParse(uuid);
    await claimer.createLockedCampaign(altId, campaign, lockup, donation);
    await claimer.cancelCampaign(altId);
    let proof = getProof('./test/trees/tree.json', b.address);
    await expect(claimer.connect(b).claimTokens(altId, proof, C.E18_1000)).to.be.revertedWith('campaign ended');
  });
  it('cancel will revert if its already been cancelled', async () => {
    await expect(claimer.cancelCampaign(altId)).to.be.revertedWith('!manager');
  });
  it('cancel will revert if its already been fully claimed', async () => {
    let values = [
      [a.address, C.E18_100],
      [b.address, C.E18_100],
    ];
    let anotherRoot = createTree(values, ['address', 'uint256']);
    campaign.root = anotherRoot;
    campaign.amount = C.E18_100.mul(2);
    let uuid = uuidv4();
    altId = uuidParse(uuid);
    await claimer.createLockedCampaign(altId, campaign, lockup, donation);
    let proofA = getProof('./test/trees/tree.json', a.address);
    let proofB = getProof('./test/trees/tree.json', b.address);
    await claimer.connect(a).claimTokens(altId, proofA, C.E18_100);
    await claimer.connect(b).claimTokens(altId, proofB, C.E18_100);
    await expect(claimer.cancelCampaign(altId)).to.be.revertedWith('!manager');
  });
};

module.exports = {
  claimTests,
  claimErrorTests,
};
