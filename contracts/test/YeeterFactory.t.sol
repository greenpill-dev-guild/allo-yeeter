// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import "forge-std/console2.sol";
import {YeeterFactory} from "../src/YeeterFactory.sol";
import {YeeterStrategy} from "../src/YeeterStrategy.sol";
import {IAllo} from "allo/contracts/core/interfaces/IAllo.sol";
import {IRegistry} from "allo/contracts/core/interfaces/IRegistry.sol";
import {Metadata} from "allo/contracts/core/libraries/Metadata.sol";
import {MockERC20} from "./MockERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

import {AlloSetup} from "allo/test/foundry/shared/AlloSetup.sol";
import {RegistrySetupFull} from "allo/test/foundry/shared/RegistrySetup.sol";

contract YeeterFactoryTest is Test, AlloSetup, RegistrySetupFull {
    YeeterFactory public factory;
    address public allo_address;
    address public registry_address;
    address public mockStrategyTemplate;
    address public deployer;
    address public user;
    MockERC20 public token;

    event StrategyDeployed(address indexed strategyDeployer, address indexed strategyAddress);
    event StrategyTemplateUpdated(address indexed newTemplateAddress);

    function setUp() public {
        deployer = address(this);
        user = makeAddr("user");
        // mockStrategyTemplate = address(new YeeterStrategy(address(allo()), "Test"));
        token = new MockERC20("Test", "TEST");
        token.mint(deployer, 1000);

        __RegistrySetupFull();
        __AlloSetup(address(registry()));

        // factory = new YeeterFactory(allo_address, registry_address, payable(mockStrategyTemplate));
        console2.log("allo_address", address(allo()));
        console2.log("registry_address", address(registry()));
        factory = new YeeterFactory(address(allo()));
    }

    function testConstructor() public view {
        // assertEq(address(factory.strategyTemplate()), mockStrategyTemplate);
        assertEq(address(factory.s_allo()), address(allo()));
    }

    function testDeployStrategy() public {
        vm.prank(user);
        address newStrategy = factory.deployStrategy("Test");

        assertNotEq(newStrategy, address(0));
        assertEq(factory.getStrategyCount(), 1);
        assertEq(factory.getAllStrategies()[0], newStrategy);
        assertEq(factory.getDeployedStrategies(user)[0], newStrategy);
    }

    function testGetDeployedStrategies() public {
        // Deploy a strategy
        vm.prank(user);
        address newStrategy = factory.deployStrategy("Test");

        // Check if the deployed strategy is correctly recorded
        address[] memory deployedStrategies = factory.getDeployedStrategies(user);
        assertEq(deployedStrategies.length, 1);
        assertEq(deployedStrategies[0], newStrategy);
    }

    function testGetAllStrategies() public {
        // Deploy two strategies
        vm.prank(user);
        address strategy1 = factory.deployStrategy("Test1");
        vm.prank(address(0x3));
        address strategy2 = factory.deployStrategy("Test2");

        // Check if all strategies are correctly recorded
        address[] memory allStrategies = factory.getAllStrategies();
        assertEq(allStrategies.length, 2);
        assertEq(allStrategies[0], strategy1);
        assertEq(allStrategies[1], strategy2);
    }

    function testGetStrategyCount() public {
        assertEq(factory.getStrategyCount(), 0);

        vm.prank(user);
        factory.deployStrategy("Test1");
        assertEq(factory.getStrategyCount(), 1);

        vm.prank(address(0x3));
        factory.deployStrategy("Test2");
        assertEq(factory.getStrategyCount(), 2);
    }

    function testDeployer_CanAllocateFunds() public {
        vm.prank(deployer);
        address newStrategy = factory.deployStrategy("Test1");

        address[] memory poolManagers = new address[](3);
        poolManagers[0] = deployer;
        poolManagers[1] = makeAddr("poolManager1");
        poolManagers[2] = makeAddr("poolManager2");

        bytes32 profileId = registry().createProfile(0, "Test", Metadata({protocol: 0, pointer: "Test"}), deployer, poolManagers);
        console2.logBytes32(profileId);

        token.approve(address(allo()), 1000);

        uint256 poolId = allo().createPoolWithCustomStrategy(profileId, newStrategy, abi.encode(""), address(token), 1000, Metadata({protocol: 0, pointer: "Test"}), poolManagers);


        address[] memory recipientIds = new address[](1);
        recipientIds[0] = makeAddr("recipient");
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 800;

        allo().allocate(poolId, abi.encode(recipientIds, amounts, address(token)));

        assertEq(token.balanceOf(makeAddr("recipient")), 800);
    }
}
