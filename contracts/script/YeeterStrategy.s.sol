// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";

import {YeeterStrategy} from "src/YeeterStrategy.sol";

/// @notice A very simple deployment script
contract YeeterStrategyDeploy is Script {
    address public constant ALLO = 0xB087535DB0df98fC4327136e897A5985E5Cfbd66;
    function run() external returns (YeeterStrategy yeeterStrategy) {
        vm.startBroadcast();
        // Calculate the salt for create2
        bytes32 salt = keccak256(abi.encodePacked("YeeterStrategy"));

        // Deploy the contract using create2
        yeeterStrategy = new YeeterStrategy{salt: salt}(ALLO, "Yeeter");

        // Log the deployed address
        // console.log("YeeterStrategy deployed at:", address(yeeterStrategy));

        // Calculate and log the expected address
        address expectedAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            salt,
            keccak256(abi.encodePacked(
                type(YeeterStrategy).creationCode,
                abi.encode(ALLO, "Yeeter")
            ))
        )))));
        // console.log("Expected address:", expectedAddress);

        // Verify the deployment
        require(address(yeeterStrategy) == expectedAddress, "Deployment address mismatch");

        vm.stopBroadcast();
    }
}