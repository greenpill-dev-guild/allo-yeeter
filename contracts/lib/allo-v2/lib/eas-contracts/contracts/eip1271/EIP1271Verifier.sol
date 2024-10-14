// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { EIP712 } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { SignatureChecker } from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

// prettier-ignore
import {
    AttestationRequestData,
    DelegatedAttestationRequest,
    DelegatedRevocationRequest,
    RevocationRequestData
} from "../IEAS.sol";

import { Signature, InvalidSignature } from "../Common.sol";

/// @title EIP1271Verifier
/// @notice EIP1271Verifier typed signatures verifier for EAS delegated attestations.
abstract contract EIP1271Verifier is EIP712 {
    using Address for address;

    // The hash of the data type used to relay calls to the attest function. It's the value of
    // keccak256("Attest(bytes32 schema,address recipient,uint64 expirationTime,bool revocable,bytes32 refUID,bytes data,uint256 nonce)").
    bytes32 private constant ATTEST_TYPEHASH = 0xdbfdf8dc2b135c26253e00d5b6cbe6f20457e003fd526d97cea183883570de61;

    // The hash of the data type used to relay calls to the revoke function. It's the value of
    // keccak256("Revoke(bytes32 schema,bytes32 uid,uint256 nonce)").
    bytes32 private constant REVOKE_TYPEHASH = 0xa98d02348410c9c76735e0d0bb1396f4015ac2bb9615f9c2611d19d7a8a99650;

    // The user readable name of the signing domain.
    string private _name;

    // Replay protection nonces.
    mapping(address attester => uint256 nonce) private _nonces;

    /// @notice Creates a new EIP1271Verifier instance.
    /// @param version The current major version of the signing domain
    constructor(string memory name, string memory version) EIP712(name, version) {
        _name = name;
    }

    /// @notice Returns the domain separator used in the encoding of the signatures for attest, and revoke.
    /// @return The domain separator used in the encoding of the signatures for attest, and revoke.
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    /// @notice Returns the current nonce per-account.
    /// @param account The requested account.
    /// @return The current nonce.
    function getNonce(address account) external view returns (uint256) {
        return _nonces[account];
    }

    /// @notice Returns the EIP712 type hash for the attest function.
    /// @return The EIP712 type hash for the attest function.
    function getAttestTypeHash() external pure returns (bytes32) {
        return ATTEST_TYPEHASH;
    }

    /// @notice Returns the EIP712 type hash for the revoke function.
    /// @return The EIP712 type hash for the revoke function.
    function getRevokeTypeHash() external pure returns (bytes32) {
        return REVOKE_TYPEHASH;
    }

    /// @notice Returns the EIP712 name.
    /// @return The EIP712 name.
    function getName() external view returns (string memory) {
        return _name;
    }

    /// @notice Verifies delegated attestation request.
    /// @param request The arguments of the delegated attestation request.
    function _verifyAttest(DelegatedAttestationRequest memory request) internal {
        AttestationRequestData memory data = request.data;
        Signature memory signature = request.signature;

        uint256 nonce;
        unchecked {
            nonce = _nonces[request.attester]++;
        }

        bytes32 hash = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    ATTEST_TYPEHASH,
                    request.schema,
                    data.recipient,
                    data.expirationTime,
                    data.revocable,
                    data.refUID,
                    keccak256(data.data),
                    nonce
                )
            )
        );
        if (
            !SignatureChecker.isValidSignatureNow(
                request.attester,
                hash,
                abi.encodePacked(signature.r, signature.s, signature.v)
            )
        ) {
            revert InvalidSignature();
        }
    }

    /// @notice Verifies delegated revocation request.
    /// @param request The arguments of the delegated revocation request.
    function _verifyRevoke(DelegatedRevocationRequest memory request) internal {
        RevocationRequestData memory data = request.data;
        Signature memory signature = request.signature;

        uint256 nonce;
        unchecked {
            nonce = _nonces[request.revoker]++;
        }

        bytes32 hash = _hashTypedDataV4(keccak256(abi.encode(REVOKE_TYPEHASH, request.schema, data.uid, nonce)));
        if (
            !SignatureChecker.isValidSignatureNow(
                request.revoker,
                hash,
                abi.encodePacked(signature.r, signature.s, signature.v)
            )
        ) {
            revert InvalidSignature();
        }
    }
}
