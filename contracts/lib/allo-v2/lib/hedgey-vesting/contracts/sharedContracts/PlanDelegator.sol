// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

abstract contract PlanDelegator is ERC721Enumerable {
  // mapping of tokenId to address who can delegate an NFT on behalf of the owner
  /// @dev follows tokenApprovals logic
  mapping(uint256 => address) private _approvedDelegators;

  /// @dev operatorApprovals simialr to ERC721 standards
  mapping(address => mapping(address => bool)) private _approvedOperatorDelegators;

  /// @dev event that is emitted when a single plan delegator has been approved
  event DelegatorApproved(uint256 indexed id, address owner, address delegator);

  /// @dev event emit when the operator delegator has been approved to manage all delegation of a single address
  event ApprovalForAllDelegation(address owner, address operator, bool approved);

  /// @notice function to assign a single planId to a delegator. The delegator then has authority to call functions on other contracts such as delegate
  /// @param delegator is the address of the delegator who can delegate on behalf of the nft owner
  /// @param planId is the id of the vesting or lockup plan
  function approveDelegator(address delegator, uint256 planId) public virtual {
    address owner = ownerOf(planId);
    require(msg.sender == owner || isApprovedForAllDelegation(owner, msg.sender), '!ownerOperator');
    require(delegator != msg.sender, '!self approval');
    _approveDelegator(delegator, planId);
  }

  /// @notice function that performs both the approveDelegator function and approves a spender
  /// @param spender is the address who is approved to spend and is also a Delegator
  /// @param planId is the vesting plan id
  function approveSpenderDelegator(address spender, uint256 planId) public virtual {
    address owner = ownerOf(planId);
    require(
      msg.sender == owner || (isApprovedForAllDelegation(owner, msg.sender) && isApprovedForAll(owner, msg.sender)),
      '!ownerOperator'
    );
    require(spender != msg.sender, '!self approval');
    _approveDelegator(spender, planId);
    _approve(spender, planId);
  }

  /// @notice this function sets an address to be an operator delegator for the msg.sender, whereby the operator can delegate all tokens owned by the msg.sender
  /// the operator can also approve other single plan delegators
  /// @param operator address of the operator for the msg.sender
  /// @param approved boolean for approved if true, and false if not
  function setApprovalForAllDelegation(address operator, bool approved) public virtual {
    _setApprovalForAllDelegation(msg.sender, operator, approved);
  }

  /// @notice functeion to set the approval operator for both delegation and for spending NFTs of the msg.sender
  /// @param operator is the address who will be allowed to spend and delegate
  /// @param approved is the bool determining if they are allowed or not
  function setApprovalForOperator(address operator, bool approved) public virtual {
    _setApprovalForAllDelegation(msg.sender, operator, approved);
    _setApprovalForAll(msg.sender, operator, approved);
  }

  /// @notice internal function to update the storage of approvedDelegators and emit the event
  function _approveDelegator(address delegator, uint256 planId) internal virtual {
    _approvedDelegators[planId] = delegator;
    emit DelegatorApproved(planId, ownerOf(planId), delegator);
  }

  /// @notice internal function to update the storage of approvedOperatorDelegators, and emit the event
  function _setApprovalForAllDelegation(address owner, address operator, bool approved) internal virtual {
    require(owner != operator, '!operator');
    _approvedOperatorDelegators[owner][operator] = approved;
    emit ApprovalForAllDelegation(owner, operator, approved);
  }

  /// @notice we call the beforeTokenTransfer hook to delete the approvedDelegators storage variable so that the Delegator approval does not travel with the NFT when transferred
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    delete _approvedDelegators[firstTokenId];
  }

  /// @notice function to get the approved delegator of a single planId
  function getApprovedDelegator(uint256 planId) public view returns (address) {
    _requireMinted(planId);
    return _approvedDelegators[planId];
  }

  /// @notice function to evaluate if an operator is approved to manage delegations of an owner address
  function isApprovedForAllDelegation(address owner, address operator) public view returns (bool) {
    return _approvedOperatorDelegators[owner][operator];
  }

  /// @notice internal view function to determine if a delegator, typically the msg.sender is allowed to delegate a token, based on being either the Owner, Delegator or Operator.
  function _isApprovedDelegatorOrOwner(address delegator, uint256 planId) internal view returns (bool) {
    address owner = ownerOf(planId);
    return (delegator == owner ||
      isApprovedForAllDelegation(owner, delegator) ||
      getApprovedDelegator(planId) == delegator);
  }
}
