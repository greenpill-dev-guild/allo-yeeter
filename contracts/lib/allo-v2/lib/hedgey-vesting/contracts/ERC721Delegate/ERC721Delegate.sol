// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import '../sharedContracts/PlanDelegator.sol';

abstract contract ERC721Delegate is PlanDelegator {
  event TokenDelegated(uint256 indexed tokenId, address indexed delegate);
  event DelegateRemoved(uint256 indexed tokenId, address indexed delegate);

  function _delegateToken(address delegate, uint256 tokenId) internal {
    require(_isApprovedDelegatorOrOwner(msg.sender, tokenId), '!delegator');
    _transferDelegate(delegate, tokenId);
  }

  // function for minting should add the token to the delegate and increase the balance
  function _addDelegate(address to, uint256 tokenId) private {
    uint256 length = _delegateBalances[to];
    _delegatedTokens[to][length] = tokenId;
    _delegatedTokensIndex[tokenId] = length;
    _delegates[tokenId] = to;
    _delegateBalances[to] += 1;
    emit TokenDelegated(tokenId, to);
  }

  // function for burning should reduce the balances and set the token mapped to 0x0 address
  function _removeDelegate(uint256 tokenId) private {
    address from = delegatedTo(tokenId);
    uint256 lastTokenIndex = _delegateBalances[from] - 1;
    uint256 tokenIndex = _delegatedTokensIndex[tokenId];
    if (tokenIndex != lastTokenIndex) {
      uint256 lastTokenId = _delegatedTokens[from][lastTokenIndex];
      _delegatedTokens[from][tokenIndex] = lastTokenId;
      _delegatedTokensIndex[lastTokenId] = tokenIndex;
    }
    delete _delegatedTokensIndex[tokenId];
    delete _delegatedTokens[from][lastTokenIndex];
    _delegateBalances[from] -= 1;
    _delegates[tokenId] = address(0);
    emit DelegateRemoved(tokenId, from);
  }

  // function for transfering should reduce the balances of from by 1, increase the balances of to by 1, and set the delegate address To
  function _transferDelegate(address to, uint256 tokenId) internal {
    _removeDelegate(tokenId);
    _addDelegate(to, tokenId);
  }

  //mapping from tokenId to the delegate address
  mapping(uint256 => address) private _delegates;

  // mapping from delegate address to token count
  mapping(address => uint256) private _delegateBalances;

  // mapping from delegate to the list of delegated token Ids
  mapping(address => mapping(uint256 => uint256)) private _delegatedTokens;

  // maping from token ID to the index of the delegates token list
  mapping(uint256 => uint256) private _delegatedTokensIndex;

  function balanceOfDelegate(address delegate) public view returns (uint256) {
    require(delegate != address(0), '!address(0)');
    return _delegateBalances[delegate];
  }

  function delegatedTo(uint256 tokenId) public view returns (address) {
    address delegate = _delegates[tokenId];
    require(delegate != address(0), '!address(0)');
    return delegate;
  }

  function tokenOfDelegateByIndex(address delegate, uint256 index) public view returns (uint256) {
    require(index < _delegateBalances[delegate], 'out of bounds');
    return _delegatedTokens[delegate][index];
  }

  function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual override {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    uint256 tokenId = firstTokenId;
    if (from == address(0)) {
      _addDelegate(to, tokenId);
    }
    if (to == address(0)) { 
      _removeDelegate(tokenId);
    }
  }
}
