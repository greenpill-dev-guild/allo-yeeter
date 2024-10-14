# Token Lockup and Vesting Plans

Token Lockup and Vesting Plans are the backbone contracts for supporting responsible token allocations to investors, employees and contributors. This repository contains the smart contracts (EVM compatible) that are used by Hedgey to bring the products to life.  

The plans lock up ERC20 tokens, and then mint a recipient an ERC721 token to represent their right to unlock those tokens based on time vesting and time unlocking. The schedule of vesting and unlocking is linear, but periodic. Periods are based on seconds, and so may be per second unlocking, or can unlock each day, week, or any number of periodic frequency based on the same number of seconds. 

Plan features include the ability to add a start date to begin the unlocking / vesting process, back or future dated, as well as a cliff date for when the first chunk of tokens may be redeemed. 

Vesting Plans have a Vesting Admin that is responsible for revoking and plans distributed to a beneficiary, should they cut ties, for example if an employee leaves a company. 
Lockup plans are not revokable, but are by default transferable. 

The plans super powers include: 
  - the ability to partially redeem tokens (as opposed to redeeming the entire unlocked amount)
  - Voting with locked and unvested tokens (there is a Snapshot optimized and a On-chain governance optimized contract)
  - Ability to break up lockup plans into smaller segements, and then recombine them (for sub-delegation of voting, or selling in OTC secondary markets)


## Contracts Overview
These contracts below are the set of contracts that any user will interact with, whether via user interface application or by direct smart contract interaction. 

Contracts that hold tokens owned by end users, which each amount of tokens vesting / unlocking by the beneficiary is an NFT object with the vesting / unlocking details: 

- TokenVestingPlans.sol: Vesting Plans with snapshot voting optimization
- VotingTokenVestingPlans.sol: Vesting Plans built with on-chain governance functionality
- TokenLockupPlans.sol: Lockup Plans with snapshot voting optimization (NFTs are transferable)
- VotingTokenLockupPlans.sol: Lockup Plans built with on-chain governance functionality (NFTs are transferable)
- TokenLockupPlans_Bound.sol: Lockup plans with snapshot voting optimization (NFTs are not transferable)
- VotingTokenLockupPlans_Bound.sol: Lockup plans built with on-chain governance functionality (NFTs are not transferable)

Intermediary Contracts that temporarily hold tokens or route them from creators to beneficiaries: 
- BatchPlanner.sol: Contract for creating multiple vesting or lockup plans at the same time in a large batch. A simple contract to assist with generating many NFT vesting and lockup plans in a single transaction
- ClaimCampaigns.sol: Contract for creating a community token claim distribution, which stores tokens on behalf of the creator before the claim process, when tokens are distributed to the claimants. Interfaces with the Vesting and Lockup plans so that claim distributions can distribute locked or vesting tokens, or unlocked liquid tokens. 

## Repository Navigation
The smart contracts are all located in the ./contracts folder. The Final End User contracts are in the ./contracts/LockupPlans and ./contracts/VestingPlans folders. The lockup plan contracts are in the LockupPlans folder, and vesting plan contracts in the VestingPlans folder. The on-chain voting optimized contracts are named with Voting in the contract name, while the snapshot optimized contracts do not contain this explicit word. 

Periphery Contracts are used in addition to the core for users to quickly create and distribute multiple plans at the same time, either by direct distribution using the BatchPlanner, or via an upload and claim method via the ClaimCampaigner. 

The Plan contracts use some shared contracts for NFT uri admin at deployment, on-chain voting vault contract. 

The core storage for the lockup and vesting plans is in the ./contracts/sharedContracts/LockedStorage.sol and VestingStorage.sol files, which has the structs, mapping and events that are used throughout the primary plan contract files.  

ERC721Delegate contract is a special iteration of the ERC721Enumerable extension that enables users to delegate their NFT to another wallet, which is optimized for snapshot voting strategies. The snapshot optimized contracts inherit the ERC721Delegate, while the on-chain voting contracts inherit the ERC721Enumerable for gas savings and efficiencies. 

There are technical documentation in this repository in the technical documentation folder that describe the contracts functions and uses, and technical requirements. For more information please visit [Hedgey Website](https://hedgey.finance)

The Version1 of these contracts can be found with audit at: https://github.com/hedgey-finance/StreamVestingNFT (and audit: https://github.com/hedgey-finance/StreamVestingNFT/blob/master/audit/Hedgey_SC%20Audit%20Report_06042023_%5BSA-1070%5D.pdf).

## Testing
Clone repository

``` bash
npm install
npx hardhat compile
npx hardhat test
```

## Deployment
To deploy the contracts you should create a .env file, and add your private keys, network rpc URL, and etherscan API Key. Update the deploy.js file in the /scripts folder to deploy the desired contracts, and update the constructor argument parameters with the desired ERC721 Collection Name and Symbol. The deploy script will deploy and verify all of the files in a single function call, for a given network that supports the automated hardhat verification step. 

``` bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Testnet Deployments
# Sepolia Network:   
TokenVestingPlans: `0xF5b3b163B0DfDF3C4Be9265aE17C1915d9a15872`  
VotingTokenVestingPlans: `0x4F0AA7Ce4C3d94b6256D109CaF6e843F78B3Ef96`

TokenLockupPlans: `0x3eB5A6935A68190f74e981092BDcCf1454646446`  
VotingTokenLockupPlans: `0xB82b292C9e33154636fe8839fDb6d4081Da5c359`  

TokenLockupPlans_Bound: `0x90bA665860E1F9934F0cF2575eB8eCac2E0E17Af`  
VotingTokenLockupPlans_Bound: `0x2cE4DC254a4B48824e084791147Ff7220F1A08a7`  

BatchPlaner: `0xd8B085f666299E52f24e637aB1076ba5C2c38045`  
ClaimCampaigns: `0x46fdC2f4bA2Af46A50e610044eB35Fb0304F0aec`  

# Goerli Network 
TokenVestingPlans: `0x3eB5A6935A68190f74e981092BDcCf1454646446`  
VotingTokenVestingPlans: `0xB82b292C9e33154636fe8839fDb6d4081Da5c359`

TokenLockupPlans: `0x90bA665860E1F9934F0cF2575eB8eCac2E0E17Af`  
VotingTokenLockupPlans: `0x2cE4DC254a4B48824e084791147Ff7220F1A08a7`  

TokenLockupPlans_Bound: `0xd8B085f666299E52f24e637aB1076ba5C2c38045`  
VotingTokenLockupPlans_Bound: `0xc6229b2D6F3948d3500a161Ef0c586267dc3Ac43`  

BatchPlaner: `0x3Ef93dDE3F8e5dA878E99d7125d1C7434FB07c54`    
ClaimCampaigns: `0xB163e84188005b231467e734cEE1262BC882DF09`  

## Mainnet Deployments

The following networks have been deployed to mainnet contracts, at the same address for each network:   
- Ethereum Mainnet  
- ArbitrumOne  
- Optimism
- Celo  
- Polygon  
- Fantom (Opera)  
- Avalanche C-Chain  
- Gnosis Chain
- BASE
- Mantle
- Aurora
- Binance Smart Chain (BSC)
- Boba
- Harmony One
- Evmos
- OEC (OkEx Chain)
- Palm Network
- Public Goods Network (PGN)  

TokenVestingPlans: `0xd240f76C57fB18196A864B8b06E9b168C98c4524`

VotingTokenVestingPlans: `0x1b03D75094884714973f22867359dE4b81AF2F00`

TokenLockupPlans: `0x1B24CAe1De08ec8b3Ce0C55F9eE30Db747fd72aE`

VotingTokenLockupPlans: `0x73cD8626b3cD47B009E68380720CFE6679A3Ec3D`

Bound-TokenLockupPlans: `0x040A92F07B65E6C2C10FFfaf91DdC50F3d7b4319`

Bound-VotingTokenLockupPlans: `0xdE8465D44eBfC761Ee3525740E06C916886E1aEB`

BatchPlanner: `0x3466EB008EDD8d5052446293D1a7D212cb65C646`

ClaimCampaigns: `0x1E9FFaA25d5F8206c697c92BCdee9FA16455CF94`    
  
  
    
- zkSync Era Mainnet:  

TokenVestingPlans: `0xCef102fa950eEC13EbcB42D77cfCE3fFC43A235A`

VotingTokenVestingPlans: `0x9D889571aCa1470d8b0e2ae363a6a52F51301d16`

TokenLockupPlans: `0x6ABFF507043e626aB3Cc80d8845cB575E29f0bc4`

VotingTokenLockupPlans: `0xBfCBCa1E26d2403d54E54ec51cb19bc4Da6a6bBf`

Bound-TokenLockupPlans: `0x18E7Ff25521b8c2Aea53dE5941909Bb75b506488`

Bound-VotingTokenLockupPlans: `0xD080fdf3E80EA3AB7e979B5f418fe41C700f8c78`

BatchPlanner: `0xf7a5Fe7b99eFa24456C7b7F20485B507e68361BE`

ClaimCampaigns: `0xfb40B95Ab3903cB7361EED4Fc9D5DC6aC628803E`
