// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {YeeterStrategy} from "./YeeterStrategy.sol";
import {IAllo} from "allo/contracts/core/interfaces/IAllo.sol";
import {IRegistry} from "allo/contracts/core/interfaces/IRegistry.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Clones} from "openzeppelin-contracts/contracts/proxy/Clones.sol";
import {Metadata} from "allo/contracts/core/libraries/Metadata.sol";

contract YeeterFactory is Ownable {
    mapping(address => address[]) public s_deployedStrategies;
    address[] public s_allStrategies;
    uint256 private s_nonce;

    IAllo public immutable s_allo;

    event StrategyDeployed(address indexed strategyDeployer, address indexed strategyAddress);
    // event StrategyTemplateUpdated(address indexed newTemplateAddress);

    // YeeterStrategy public strategyTemplate;

    constructor(address _allo) Ownable(msg.sender) {
        s_allo = IAllo(_allo);
    }

    function deployStrategy(string memory _name) external returns (address) {
        YeeterStrategy newStrategy = new YeeterStrategy(address(s_allo), _name);

        s_deployedStrategies[msg.sender].push(address(newStrategy));
        s_allStrategies.push(address(newStrategy));

        emit StrategyDeployed(msg.sender, address(newStrategy));

        return address(newStrategy);
    }

    function getDeployedStrategies(address _strategyDeployer) external view returns (address[] memory) {
        return s_deployedStrategies[_strategyDeployer];
    }

    function getAllStrategies() external view returns (address[] memory) {
        return s_allStrategies;
    }

    function getStrategyCount() external view returns (uint256) {
        return s_allStrategies.length;
    }

    // function updateStrategyTemplate(address _newTemplateAddress) external onlyOwner {
    //     strategyTemplate = YeeterStrategy(payable(_newTemplateAddress));
    //     emit StrategyTemplateUpdated(_newTemplateAddress);
    // }
}
