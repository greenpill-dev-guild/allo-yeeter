// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {YeeterFactory} from "../src/YeeterFactory.sol";

contract YeeterFactoryDeploy is Script {
    address public constant ALLO = 0xB087535DB0df98fC4327136e897A5985E5Cfbd66;

    function run() external returns (YeeterFactory yeeterFactory) {
        vm.startBroadcast();
        // Calculate the salt for create2
        bytes32 salt = keccak256(abi.encodePacked("YeeterFactory"));

        // Deploy the contract using create2
        yeeterFactory = new YeeterFactory{salt: salt}(ALLO);
        console.log("YeeterFactory deployed to:", address(yeeterFactory));

        vm.stopBroadcast();
    }
}