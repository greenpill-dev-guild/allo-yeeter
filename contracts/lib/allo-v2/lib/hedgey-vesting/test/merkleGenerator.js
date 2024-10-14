const { StandardMerkleTree } = require('@openzeppelin/merkle-tree');
const fs = require('fs');

const createTree = (values, types) => {
  const tree = StandardMerkleTree.of(values, types);
  fs.writeFileSync('./test/trees/tree.json', JSON.stringify(tree.dump()));
  return tree.root;
};

const getProof = (treeFile, value) => {
  const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync(treeFile)));
  let proof = [];
  for (const [i, v] of tree.entries()) {
    if (v[0] == value) {
      proof = tree.getProof(i);
    }
  }
  return proof;
};

module.exports = {
  createTree,
  getProof,
};
