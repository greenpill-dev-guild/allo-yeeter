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
import {SafeTransferLib} from "lib/allo-v2/lib/solady/src/utils/SafeTransferLib.sol";

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

        vm.prank(address(pool_admin()));
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

    function test_allocate_insufficient_funds() public {
        address[] memory recipientIds = new address[](1);
        uint256[] memory amounts = new uint256[](1);

        recipientIds[0] = makeAddr("Recipient");
        amounts[0] = 2000; // More than the available balance

        vm.startPrank(pool_admin());
        vm.expectRevert(SafeTransferLib.TransferFailed.selector);
        allo().allocate(poolId, abi.encode(recipientIds, amounts, token));
        vm.stopPrank();
    }

    function test_allocate_cannot_allocate_zero_amount() public {
        address[] memory recipientIds = new address[](2);
        uint256[] memory amounts = new uint256[](2);

        recipientIds[0] = makeAddr("Recipient");
        recipientIds[1] = makeAddr("Recipient2");
        amounts[0] = 100; // Non-zero amount
        amounts[1] = 0; // Zero amount

        allo().fundPool(poolId, 1000);

        vm.startPrank(pool_admin());
        allo().allocate(poolId, abi.encode(recipientIds, amounts, token));
        vm.stopPrank();

        assertEq(token.balanceOf(recipientIds[0]), 100);
        assertEq(token.balanceOf(recipientIds[1]), 0);
    }

    function test_allocate_multiple_recipients() public {
        address[] memory recipientIds = new address[](3);
        uint256[] memory amounts = new uint256[](3);

        recipientIds[0] = makeAddr("Recipient1");
        recipientIds[1] = makeAddr("Recipient2");
        recipientIds[2] = makeAddr("Recipient3");
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;

        allo().fundPool(poolId, 1000);

        vm.startPrank(pool_admin());
        allo().allocate(poolId, abi.encode(recipientIds, amounts, token));
        vm.stopPrank();

        assertEq(token.balanceOf(recipientIds[0]), 100);
        assertEq(token.balanceOf(recipientIds[1]), 200);
        assertEq(token.balanceOf(recipientIds[2]), 300);
        assertEq(token.balanceOf(address(strategy)), 390);
    }

    function test_allocate_input_length_mismatch() public {
        address[] memory recipientIds = new address[](2);
        uint256[] memory amounts = new uint256[](3);

        recipientIds[0] = makeAddr("Recipient1");
        recipientIds[1] = makeAddr("Recipient2");
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;

        vm.startPrank(pool_admin());
        vm.expectRevert(YeeterStrategy.INPUT_LENGTH_MISMATCH.selector);
        allo().allocate(poolId, abi.encode(recipientIds, amounts, token));
        vm.stopPrank();
    }

    function test_withdraw() public {
        uint256 initialBalance = token.balanceOf(address(strategy));
        uint256 withdrawAmount = 100;
        address recipient = makeAddr("WithdrawRecipient");

        allo().fundPool(poolId, 1000);

        uint256 newBalance = token.balanceOf(address(strategy));

        vm.startPrank(pool_admin());
        strategy.withdraw(address(token), recipient, withdrawAmount);
        vm.stopPrank();

        assertEq(token.balanceOf(address(strategy)), newBalance - withdrawAmount);
        assertEq(token.balanceOf(recipient), withdrawAmount);
    }

    function testRevert_withdraw_unauthorized() public {
        address unauthorizedUser = makeAddr("UnauthorizedUser");
        uint256 withdrawAmount = 100;
        address recipient = makeAddr("WithdrawRecipient");

        vm.startPrank(unauthorizedUser);
        vm.expectRevert(UNAUTHORIZED.selector);
        strategy.withdraw(address(token), recipient, withdrawAmount);
        vm.stopPrank();
    }

    function testFuzz_allocate(uint64[10] memory _amounts) public {
        address[] memory recipientIds = new address[](10);
        uint256[] memory amounts = new uint256[](10);
        uint256 totalAmount = 0;

        for(uint256 i = 0; i < 10; i++) {
            recipientIds[i] = makeAddr(string(abi.encodePacked("Recipient", i))); 
            amounts[i] = (uint256(_amounts[i]) * 99) / 100; // Limit each amount to 99% of the total amount
            totalAmount += _amounts[i];
        }

        token.mint(address(this), totalAmount);
        token.approve(address(allo()), totalAmount);

        allo().fundPool(poolId, totalAmount);

        vm.startPrank(pool_admin());
        allo().allocate(poolId, abi.encode(recipientIds, amounts, address(token)));
        vm.stopPrank();

        for(uint256 i = 0; i < 10; i++) {
            assertEq(token.balanceOf(recipientIds[i]), amounts[i]);
        }
    }

    function test_withdraw_all() public {
        uint256 fundAmount = 1000;
        address recipient = makeAddr("WithdrawRecipient");

        allo().fundPool(poolId, fundAmount);

        uint256 contractBalance = token.balanceOf(address(strategy));

        vm.startPrank(pool_admin());
        strategy.withdraw(address(token), recipient, contractBalance);
        vm.stopPrank();

        assertEq(token.balanceOf(address(strategy)), 0);
        assertEq(token.balanceOf(recipient), contractBalance);
    }

    function testRevert_withdraw_insufficient_balance() public {
        uint256 fundAmount = 1000;
        uint256 withdrawAmount = 2000;
        address recipient = makeAddr("WithdrawRecipient");

        allo().fundPool(poolId, fundAmount);

        vm.startPrank(pool_admin());
        vm.expectRevert();
        strategy.withdraw(address(token), recipient, withdrawAmount);
        vm.stopPrank();
    }

    function testRevert_distribute() public {
        vm.prank(pool_admin());
        vm.expectRevert(YeeterStrategy.NOOP.selector);
        allo().distribute(poolId, new address[](0), "");
    }

    function testRevert_getRecipientStatus() public {
        vm.expectRevert(YeeterStrategy.NOOP.selector);
        strategy.getRecipientStatus(address(0));
    }

    function testRevert_isValidAllocator() public {
        vm.expectRevert(YeeterStrategy.NOOP.selector);
        strategy.isValidAllocator(address(0));
    }

    function testRevert_registerRecipient() public {
        vm.expectRevert(YeeterStrategy.NOOP.selector);
        allo().registerRecipient(poolId, "");
    }
}
