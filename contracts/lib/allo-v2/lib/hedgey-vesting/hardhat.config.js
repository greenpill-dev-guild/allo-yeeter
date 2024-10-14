require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('hardhat-deploy');
require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP,
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    gasPrice: 40,
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.TEST_DEPLOYER_PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.TEST_DEPLOYER_PRIVATE_KEY],
    },
    optimisticGoerli: {
      url: process.env.OPTIMISTIC_GOERLI_URL,
      accounts: [process.env.TEST_DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
      gasPrice: 2000000000,
    },
    mainnet: {
      url: process.env.MAINNET_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    gnosis: {
      url: process.env.GNOSIS_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    arbitrumOne: {
      url: process.env.ARBITRUM_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    polygon: {
      url: process.env.POLYGON_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
      gasPrice: 130000000000,
    },
    opera: {
      url: process.env.FANTOM_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    avalanche: {
      url: process.env.AVALANCHE_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    bsc: {
      url: process.env.BSC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    optimisticEthereum: {
      url: process.env.OPTIMISM_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    harmony: {
      url: process.env.HARMONY_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    boba: {
      url: process.env.BOBA_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    aurora: {
      url: process.env.AURORA_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    oec: {
      url: process.env.OEC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    evmos: {
      url: process.env.EVMOS_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    celo: {
      url: process.env.CELO_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    base: {
      url: process.env.BASE_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
      gasPrice: 2000000000,
    },
    mantle: {
      url: process.env.MANTLE_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    },
    palm: {
      url: process.env.PALM_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY, process.env.TOKEN_DEPLOYER],
    }
  },
  etherscan: {
    customChains: [
      {
        network: 'gnosis',
        chainId: 100,
        urls: {
          apiURL: 'https://api.gnosisscan.io/api',
          browserURL: 'https://gnosisscan.io/',
        },
      },
      {
        network: 'boba',
        chainId: 288,
        urls: {
          apiURL: 'https://api.bobascan.com/api',
          browserURL: 'https://bobascan.com',
        },
      },
      {
        network: 'celo',
        chainId: 42220,
        urls: {
          apiURL: 'https://api.celoscan.io/api',
          browserURL: 'https://celoscan.io/',
        },
      },
      {
        network: 'mantle',
        chainId: 5000,
        urls: {
          apiURL: 'https://explorer.mantle.xyz/api',
          browserURL: 'https://explorer.mantle.xyz/',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org/',
        },
      },
      {
        network: 'aurora',
        chainId: 1313161554,
        urls: {
          apiURL: 'https://explorer.mainnet.aurora.dev/api',
          browserURL: 'https://explorer.aurora.dev/',
        },
      },
      {
        network: 'palm',
        chainId: 11297108109,
        urls: {
          apiURL: 'https://explorer.palm.io/api',
          browserURL: 'https://explorer.palm.io/',
        }
      }
    ],
    apiKey: {
      sepolia: process.env.ETHERSCAN_APIKEY,
      goerli: process.env.ETHERSCAN_APIKEY,
      mainnet: process.env.ETHERSCAN_APIKEY,
      gnosis: process.env.GNOSIS_APIKEY,
      arbitrumOne: process.env.ARBITRUM_APIKEY,
      polygon: process.env.POLYGON_APIKEY,
      opera: process.env.FANTOM_APIKEY,
      avalanche: process.env.AVALANCHE_APIKEY,
      bsc: process.env.BSC_APIKEY,
      optimisticEthereum: process.env.OPTIMISM_APIKEY,
      harmony: process.env.HARMONY_APIKEY,
      boba: process.env.BOBA_APIKEY,
      aurora: process.env.AURORA_APIKEY,
      oec: process.env.OEC_APIKEY,
      evmos: process.env.EVMOS_APIKEY,
      celo: process.env.CELO_APIKEY,
      optimisticGoerli: process.env.OPTIMISTICGOERLI_APIKEY,
      base: process.env.BASE_APIKEY,
      mantle: process.env.MANTLE_APIKEY,
      palm: process.env.PALM_APIKEY,
    },
  },
};
