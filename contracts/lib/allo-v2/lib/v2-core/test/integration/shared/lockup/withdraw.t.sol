// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Lockup_Integration_Shared_Test } from "./Lockup.t.sol";

abstract contract Withdraw_Integration_Shared_Test is Lockup_Integration_Shared_Test {
    uint256 internal defaultStreamId;

    function setUp() public virtual override {
        defaultStreamId = createDefaultStream();
        changePrank({ msgSender: users.recipient });
    }

    modifier whenNotDelegateCalled() {
        _;
    }

    modifier whenNotNull() {
        _;
    }

    modifier whenStreamNotDepleted() {
        vm.warp({ timestamp: defaults.START_TIME() });
        _;
    }

    modifier whenCallerUnauthorized() {
        _;
    }

    modifier whenCallerAuthorized() {
        _;
    }

    modifier whenToNonZeroAddress() {
        _;
    }

    modifier whenWithdrawAmountNotZero() {
        _;
    }

    modifier whenWithdrawAmountNotGreaterThanWithdrawableAmount() {
        _;
    }

    modifier whenCallerRecipient() {
        _;
    }

    modifier whenStreamHasNotBeenCanceled() {
        _;
    }
}
