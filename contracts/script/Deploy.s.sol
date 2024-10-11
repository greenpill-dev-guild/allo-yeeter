// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";

import {YeeterStrategy} from "src/YeeterStrategy.sol";

/// @notice A very simple deployment script
contract Deploy is Script {
    /// @notice The main script entrypoint
    /// @return yeeterStrategy The deployed contract
    function run() external returns (YeeterStrategy yeeterStrategy) {
        vm.startBroadcast();
        // Calculate the salt for create2
        bytes32 salt = keccak256(abi.encodePacked("YeeterStrategy"));

        // Deploy the contract using create2
        yeeterStrategy = new YeeterStrategy{salt: salt}(address(0), "Yeeter");

        // Log the deployed address
        // console.log("YeeterStrategy deployed at:", address(yeeterStrategy));

        // Calculate and log the expected address
        address expectedAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            salt,
            keccak256(abi.encodePacked(
                type(YeeterStrategy).creationCode,
                abi.encode(address(0), "Yeeter")
            ))
        )))));
        // console.log("Expected address:", expectedAddress);

        // Verify the deployment
        require(address(yeeterStrategy) == expectedAddress, "Deployment address mismatch");

        vm.stopBroadcast();
    }
}
