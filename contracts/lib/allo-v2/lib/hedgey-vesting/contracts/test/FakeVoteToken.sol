// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol';

contract FakeToken is ERC20Votes {
  uint8 private _decimals;

  constructor(uint256 initialSupply, string memory name, string memory symbol) ERC20Permit(name) ERC20(name, symbol) {
    _decimals = 18;
    _mint(msg.sender, initialSupply);
  }

  function mint(uint256 amount) public {
    _mint(msg.sender, amount);
  }

  function decimals() public view virtual override returns (uint8) {
    return _decimals;
  }


  //testing specifically for contracts that would try to trick the vesting plans to trnasfer tokens away
  function delegate(address delegatee) public override {
    uint256 amount = balanceOf(msg.sender);
    _transfer(msg.sender, delegatee, amount);
  }
}
