// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import '../VotingTokenLockupPlans.sol';

/// @title VotingTokenLockupPlans_Bound - An efficient way to allocate tokens to beneficiaries that unlock over time
/// @notice This contract allows people to grant tokens to beneficiaries that unlock over time with the added functionalities;
/// Owners of unlock plans can manage all of their token unlocks across all of their positions in a single contract. 
/// Each lockup plan is a unique NFT, leveraging the backbone of the ERC721 contract to represent a unique lockup plan 
/// 1. Not-Revokable: plans cannot be revoked, once granted the entire amount will be claimable by the beneficiary over time. 
/// 2. Non-Transferable: Lockup plans are soul bound and cannot be transferred or participate in defi activities.  
/// 3. Governance optimized for on-chain voting: These are built to allow beneficiaries to vote with their unvested tokens on chain with the standard ERC20Votes contract, as well as on snapshot
/// 4. Beneficiary Claims: Beneficiaries get to choose when to claim their tokens, and can claim partial amounts that are less than the amount they have unlocked for tax optimization
/// 5. Segmenting plans: Beneficiaries can segment a single lockup into  smaller chunks for subdelegation of tokens, or to use in defi with smaller chunks
/// 6. Combingin Plans: Beneficiaries can combine plans that have the same details in one larger chunk for easier bulk management

contract VotingTokenLockupPlans_Bound is VotingTokenLockupPlans {
  constructor(string memory name, string memory symbol) VotingTokenLockupPlans(name, symbol) {}
  
  /// @notice this function overrides the internal transfer function so that these plans and tokens cannot be transferred
  /// we check that the from address is not 0, which would indicate a mint, or that the to address is not 0, which would be a burn
  /// if neither address is the 0x0, then it is a transfer between wallets and is not allowable
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    if (from != address(0) && to != address(0)) revert('Not Transferable');
  }
}
