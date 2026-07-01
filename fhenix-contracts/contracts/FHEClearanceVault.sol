// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

/**
 * @title FHEClearanceVault — Zero-Knowledge AI Clearance & IP Authorization
 * @notice Solves the enterprise problem where verifying security clearances for confidential assets
 * (Meeting Rooms, Corporate Knowledge Graphs, System Prompts) leaks an agent or employee's exact RBAC tier.
 * @dev Powered by Fhenix FHE EVM for Kyrti saep-identity & MeetingRoomPage.
 */
contract FHEClearanceVault is Permissioned {
    // Encrypted clearance badge per identity (e.g. level 1 = Junior, level 5 = C-Suite, level 9 = Sovereign AI Governor)
    mapping(address => euint8) private clearanceBadges;

    // Encrypted minimum clearance required per enterprise resource asset URI / Room ID
    mapping(bytes32 => euint8) private resourceClearanceRequirements;

    address public securityOfficer;

    event ClearanceBadgeAssigned(address indexed identity);
    event ResourceRequirementSet(bytes32 indexed resourceId);
    event AccessAuthorizationChecked(address indexed identity, bytes32 indexed resourceId, bool granted);

    modifier onlySecurityOfficer() {
        require(msg.sender == securityOfficer, "Caller is not corporate security officer");
        _;
    }

    constructor() {
        securityOfficer = msg.sender;
    }

    /**
     * @notice Issue or update an encrypted security clearance badge for a human or AI node.
     */
    function assignClearanceBadge(address identity, inEuint8 memory encryptedLevel) external onlySecurityOfficer {
        clearanceBadges[identity] = FHE.asEuint8(encryptedLevel);
        emit ClearanceBadgeAssigned(identity);
    }

    /**
     * @notice Set encrypted clearance threshold required to access a protected meeting room or vector memory asset.
     */
    function setResourceClearance(bytes32 resourceId, inEuint8 memory encryptedRequiredLevel) external onlySecurityOfficer {
        resourceClearanceRequirements[resourceId] = FHE.asEuint8(encryptedRequiredLevel);
        emit ResourceRequirementSet(resourceId);
    }

    /**
     * @notice Evaluate zero-knowledge clearance authorization.
     * @dev Evaluates FHE.gte(userClearance, requiredClearance). Returns decrypted boolean grant WITHOUT exposing either tier.
     * @param resourceId Hash or ID of the meeting room / knowledge graph.
     */
    function verifyAccessAuthorization(bytes32 resourceId) external returns (bool) {
        require(FHE.isInitialized(clearanceBadges[msg.sender]), "Identity has no clearance badge");
        require(FHE.isInitialized(resourceClearanceRequirements[resourceId]), "Resource requirement not configured");

        euint8 userLevel = clearanceBadges[msg.sender];
        euint8 requiredLevel = resourceClearanceRequirements[resourceId];

        // Homomorphic comparison: userLevel >= requiredLevel
        ebool isAuthorizedEncrypted = FHE.gte(userLevel, requiredLevel);

        bool isGranted = FHE.decrypt(isAuthorizedEncrypted);
        emit AccessAuthorizationChecked(msg.sender, resourceId, isGranted);

        return isGranted;
    }

    /**
     * @notice Allow identity holder to read their own encrypted clearance level via sealed output.
     */
    function getMySealedClearance(Permission calldata permission) external view onlyPermitted(permission, msg.sender) returns (string memory) {
        return FHE.sealoutput(clearanceBadges[msg.sender], permission.publicKey);
    }
}
