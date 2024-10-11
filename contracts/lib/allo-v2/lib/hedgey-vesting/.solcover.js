module.exports = {
  skipFiles: [
    'test/Token.sol',
    'test/FakeVoteToken.sol',
    'test/NonVotingToken.sol',
    'ERC721Delegate/ERC721Delegate.sol',
    'ERC721Delegate/IERC721Delegate.sol',
  ],
  configureYulOptimizer: true,
};
