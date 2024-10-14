// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { ISchemaResolver } from "./resolver/ISchemaResolver.sol";

import { EMPTY_UID } from "./Common.sol";
import { Semver } from "./Semver.sol";
import { ISchemaRegistry, SchemaRecord } from "./ISchemaRegistry.sol";

/// @title SchemaRegistry
/// @notice The global schema registry.
contract SchemaRegistry is ISchemaRegistry, Semver {
    error AlreadyExists();

    // The global mapping between schema records and their IDs.
    mapping(bytes32 uid => SchemaRecord schemaRecord) private _registry;

    /// @notice Creates a new SchemaRegistry instance.
    constructor() Semver(1, 1, 0) {}

    /// @inheritdoc ISchemaRegistry
    function register(string calldata schema, ISchemaResolver resolver, bool revocable) external returns (bytes32) {
        SchemaRecord memory schemaRecord = SchemaRecord({
            uid: EMPTY_UID,
            schema: schema,
            resolver: resolver,
            revocable: revocable
        });

        bytes32 uid = _getUID(schemaRecord);
        if (_registry[uid].uid != EMPTY_UID) {
            revert AlreadyExists();
        }

        schemaRecord.uid = uid;
        _registry[uid] = schemaRecord;

        emit Registered(uid, msg.sender);

        return uid;
    }

    /// @inheritdoc ISchemaRegistry
    function getSchema(bytes32 uid) external view returns (SchemaRecord memory) {
        return _registry[uid];
    }

    /// @notice Calculates a UID for a given schema.
    /// @param schemaRecord The input schema.
    /// @return schema UID.
    function _getUID(SchemaRecord memory schemaRecord) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(schemaRecord.schema, schemaRecord.resolver, schemaRecord.revocable));
    }
}
