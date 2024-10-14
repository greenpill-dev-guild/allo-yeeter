// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {YeeterStrategy} from "./YeeterStrategy.sol";
import {IAllo} from "allo/contracts/core/interfaces/IAllo.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/// @title YeeterFactory
/// @author Lawal Abubakar <utility4all@gmail.com>
/// @notice This contract is used to deploy and manage YeeterStrategy instances
/// @dev Inherits from Ownable for access control
contract YeeterFactory is Ownable {
    /// @notice Mapping of strategy deployer addresses to their deployed strategy addresses
    /// @dev deployer address -> array of deployed strategy addresses
    mapping(address => address[]) public s_deployedStrategies;

    /// @notice Array of all deployed strategy addresses
    address[] public s_allStrategies;

    /// @notice Nonce used for generating unique identifiers
    uint256 private s_nonce;

    /// @notice Custom error for when an invalid Allo address is provided
    error INVALID_ALLO_ADDRESS();

    /// @notice Reference to the Allo contract
    /// @dev Can be updated by the owner
    IAllo public s_allo;

    /// @notice Emitted when the Allo address is updated
    /// @param oldAllo The previous Allo contract address
    /// @param newAllo The new Allo contract address
    event AlloUpdated(address indexed oldAllo, address indexed newAllo);

    /// @notice Emitted when a new strategy is deployed
    /// @param strategyDeployer The address that deployed the strategy
    /// @param strategyAddress The address of the newly deployed strategy
    event StrategyDeployed(address indexed strategyDeployer, address indexed strategyAddress);

    /// @notice Initializes the YeeterFactory contract
    /// @dev Sets the Allo contract address and the initial owner
    /// @param _allo The address of the Allo contract
    constructor(address _allo) Ownable(msg.sender) {
        s_allo = IAllo(_allo);
    }

    /// @notice Deploys a new YeeterStrategy
    /// @dev Creates a new YeeterStrategy instance and records its deployment
    /// @param _name The name of the strategy
    /// @return The address of the newly deployed strategy
    function deployStrategy(string memory _name) external returns (address) {
        YeeterStrategy newStrategy = new YeeterStrategy(address(s_allo), _name);

        s_deployedStrategies[msg.sender].push(address(newStrategy));
        s_allStrategies.push(address(newStrategy));

        emit StrategyDeployed(msg.sender, address(newStrategy));

        return address(newStrategy);
    }

    /// @notice Updates the Allo contract address
    /// @dev Only callable by the owner of the contract
    /// @param _newAllo The new address of the Allo contract
    function updateAllo(address _newAllo) external onlyOwner {
        if (_newAllo == address(0)) revert INVALID_ALLO_ADDRESS();
        address oldAllo = address(s_allo);
        s_allo = IAllo(_newAllo);
        emit AlloUpdated(oldAllo, _newAllo);
    }

    /// @notice Retrieves all strategies deployed by a specific address
    /// @param _strategyDeployer The address of the strategy deployer
    /// @return An array of addresses of deployed strategies
    function getDeployedStrategies(address _strategyDeployer) external view returns (address[] memory) {
        return s_deployedStrategies[_strategyDeployer];
    }

    /// @notice Retrieves all deployed strategies
    /// @return An array of addresses of all deployed strategies
    function getAllStrategies() external view returns (address[] memory) {
        return s_allStrategies;
    }

    /// @notice Gets the total count of deployed strategies
    /// @return The number of deployed strategies
    function getStrategyCount() external view returns (uint256) {
        return s_allStrategies.length;
    }
}
