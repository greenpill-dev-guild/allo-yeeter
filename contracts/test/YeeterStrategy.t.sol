// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

// Custom Strategy
import {YeeterStrategy} from "src/YeeterStrategy.sol";

// Allo Core Libraries
import {Metadata} from "allo/contracts/core/libraries/Metadata.sol";
import {Errors} from "allo/contracts/core/libraries/Errors.sol";

// // Test libraries
import {AlloSetup} from "allo/test/foundry/shared/AlloSetup.sol";
import {RegistrySetupFull} from "allo/test/foundry/shared/RegistrySetup.sol";

import {MockERC20} from "./MockERC20.sol";

contract YeeterStrategyTest is Test, AlloSetup, RegistrySetupFull, Errors {
    YeeterStrategy internal strategy;
    MockERC20 internal token;
    address[] internal recipients;

    bool public metadataRequired;

    Metadata public poolMetadata;

    uint256 public poolId;

    uint256 public maxBid;

    function setUp() public {
        __RegistrySetupFull();
        __AlloSetup(address(registry()));

        metadataRequired = true;

        maxBid = 1e18;

        poolMetadata = Metadata({protocol: 1, pointer: "PoolMetadata"});

        for (uint256 i = 0; i < 5; i++) {
            address recipient = makeAddr(string(abi.encodePacked("Recipient", i)));
            recipients.push(recipient);
        }

        token = new MockERC20("New Token", "NT");
        token.mint(address(this), 10000);

        token.approve(address(allo()), 10000);

        strategy = new YeeterStrategy(address(allo()), "YeeterStrategy");

        vm.prank(pool_admin());
        poolId = allo().createPoolWithCustomStrategy(
            poolProfile_id(),
            address(strategy),
            abi.encode(maxBid, metadataRequired),
            address(token),
            0,
            poolMetadata,
            pool_managers()
        );
    }

    function testRevert_initialize_ALREADY_INITIALIZED() public {
        vm.startPrank(address(allo()));
        vm.expectRevert(ALREADY_INITIALIZED.selector);
        strategy.initialize(poolId, abi.encode(maxBid, metadataRequired));
    }

    function testRevert_initialize_UNAUTHORIZED() public {
        vm.expectRevert(UNAUTHORIZED.selector);
        strategy.initialize(poolId, abi.encode(maxBid, metadataRequired));
    }

    function test_allocate() public {
        address[] memory recipientIds = new address[](5);
        uint256[] memory amounts = new uint256[](5);

        for (uint256 i = 0; i < 5; i++) {
            recipientIds[i] = makeAddr(string(abi.encodePacked("Recipient", i)));
            amounts[i] = 100;
        }

        allo().fundPool(poolId, 1000);

        vm.startPrank(address(allo()));
        bytes memory data = abi.encode(recipientIds, amounts, token);
        strategy.allocate(data, address(pool_managers()[0]));
        vm.stopPrank();

        assertEq(token.balanceOf(address(strategy)), 490);
    }

    function testRevert_allocate_UNAUTHORIZED() public {
        address[] memory recipientIds = new address[](5);
        uint256[] memory amounts = new uint256[](5);

        // Send tokens to the
        for (uint256 i = 0; i < 5; i++) {
            recipientIds[i] = makeAddr(string(abi.encodePacked("Recipient", i)));
            amounts[i] = 100;
        }

        vm.expectRevert(UNAUTHORIZED.selector);
        strategy.allocate(abi.encode(recipientIds, amounts, token), makeAddr("UNAUTHORIZED"));
    }

    function test_allocate_another_pool_manager() public {
        address[] memory recipientIds = new address[](5);
        uint256[] memory amounts = new uint256[](5);

        // Send tokens to the
        for (uint256 i = 0; i < 5; i++) {
            recipientIds[i] = makeAddr(string(abi.encodePacked("Recipient", i)));
            amounts[i] = 100;
        }

        address anotherPoolManager = makeAddr("ANOTHER_POOL_MANAGER");

        vm.startPrank(address(pool_admin()));
        allo().addPoolManager(poolId, anotherPoolManager);
        vm.stopPrank();

        vm.startPrank(anotherPoolManager);
        token.mint(anotherPoolManager, 2000);
        token.approve(address(allo()), 2000);
        allo().fundPool(poolId, 2000);
        bytes memory data = abi.encode(recipientIds, amounts, token);
        allo().allocate(poolId, data);
        vm.stopPrank();

        assertEq(token.balanceOf(address(strategy)), 1480);

        vm.startPrank(anotherPoolManager);
        bytes memory new_data = abi.encode(recipientIds, amounts, token);
        allo().allocate(poolId, new_data);
        vm.stopPrank();

        assertEq(token.balanceOf(address(strategy)), 980);
    }

    function testRevert_addPoolManager_UNAUTHORIZED() public {
        vm.expectRevert(UNAUTHORIZED.selector);
        allo().addPoolManager(poolId, makeAddr("UNAUTHORIZED"));
    }
}
