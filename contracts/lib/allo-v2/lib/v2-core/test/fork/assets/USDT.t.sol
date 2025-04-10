// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { LockupDynamic_Fork_Test } from "../LockupDynamic.t.sol";
import { LockupLinear_Fork_Test } from "../LockupLinear.t.sol";

/// @dev An ERC-20 asset that suffers from the missing return value bug.
IERC20 constant asset = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
address constant holder = 0xee5B5B923fFcE93A870B3104b7CA09c3db80047A;

contract USDT_LockupDynamic_Fork_Test is LockupDynamic_Fork_Test(asset, holder) { }

contract USDT_LockupLinear_Fork_Test is LockupLinear_Fork_Test(asset, holder) { }
