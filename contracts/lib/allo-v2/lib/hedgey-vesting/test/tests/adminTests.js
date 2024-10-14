// write all tests that related to the deployment and URI admin functions and events

const { expect } = require('chai');
const setup = require('../fixtures');
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const C = require('../constants');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

module.exports = (vesting, voting) => {
  let s, admin, a, hedgey, uri;
  it('Deploys the contract, updates and updates the Base URI', async () => {
    s = await setup();
    if (vesting && voting) hedgey = s.voteVest;
    else if (!vesting && voting) hedgey = s.voteLocked;
    else if (vesting && !voting) hedgey = s.vest;
    else hedgey = s.locked;
    admin = s.admin;
    a = s.a;
    uri = 'https://uri';
    await expect(hedgey.deleteAdmin).to.be.revertedWith('!SET');
    expect(await hedgey.updateBaseURI(uri))
      .to.emit('URISet')
      .withArgs(uri);
    expect(await hedgey.baseURI()).to.eq(uri);
  });
  it('admin can reset the URI again', async () => {
    uri = 'https://newURI';
    expect(await hedgey.updateBaseURI(uri))
      .to.emit('URISet')
      .withArgs(uri);
    expect(await hedgey.baseURI()).to.eq(uri);
  });
  // write a test for checking that only the admin can set the URI
  it('Reverts if not admin tries to update the base URI', async () => {
    await expect(hedgey.connect(a).updateBaseURI(uri)).to.be.revertedWith('!ADMIN');
  });
  it('Reverts if the not admin tries to delete the admin', async () => {
    await expect(hedgey.connect(a).deleteAdmin()).to.be.revertedWith('!ADMIN');
  });
  it('Deletes the admin', async () => {
    expect(await hedgey.deleteAdmin())
      .to.emit('URIAdminDeleted')
      .withArgs(admin.address);
  });
  it('Reverts if it tries to update the base URI after deletion', async () => {
    await expect(hedgey.updateBaseURI(uri)).to.be.revertedWith('!ADMIN');
  });
  it('Reverts if it tries to delete an admin after its been deleted', async () => {
    await expect(hedgey.deleteAdmin).to.be.revertedWith('!ADMIN');
  });
};
