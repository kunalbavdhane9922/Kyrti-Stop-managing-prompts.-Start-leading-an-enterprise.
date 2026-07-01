// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

/**
 * @title FHEPayroll — Confidential Enterprise Payroll & Automated Treasury Streaming
 * @notice Solves the enterprise problem where running payroll on public blockchains exposes salaries,
 * AI compute budgets, and SLA bonuses to competitors and internal staff.
 * @dev Powered by Fhenix FHE EVM for Kyrti saep-organization & saep-workforce.
 */
contract FHEPayroll is Permissioned {
    struct HierarchyNodeCompensation {
        string nodeId;
        address occupant;
        euint64 encryptedMonthlyRate;
        euint64 encryptedBonusRate;
        euint64 encryptedSlaTarget;
        bool isActive;
    }

    mapping(string => HierarchyNodeCompensation) private nodeCompensations;
    mapping(address => euint64) private encryptedTreasuryBalance;

    event NodeCompensationSet(string indexed nodeId, address indexed occupant);
    event EncryptedPayrollDisbursed(string indexed nodeId, address indexed recipient, bool slaMet);
    event TreasuryFunded(address indexed funder);

    address public corporateTreasuryAdmin;

    modifier onlyTreasuryAdmin() {
        require(msg.sender == corporateTreasuryAdmin, "Caller is not corporate treasury admin");
        _;
    }

    constructor() {
        corporateTreasuryAdmin = msg.sender;
    }

    /**
     * @notice Fund corporate encrypted treasury vault.
     */
    function fundEncryptedTreasury(address employeeOrAgent, inEuint64 memory amountEncrypted) external onlyTreasuryAdmin {
        euint64 deposit = FHE.asEuint64(amountEncrypted);
        if (!FHE.isInitialized(encryptedTreasuryBalance[employeeOrAgent])) {
            encryptedTreasuryBalance[employeeOrAgent] = deposit;
        } else {
            encryptedTreasuryBalance[employeeOrAgent] = FHE.add(encryptedTreasuryBalance[employeeOrAgent], deposit);
        }
        emit TreasuryFunded(employeeOrAgent);
    }

    /**
     * @notice Configure encrypted compensation tier for a hierarchy node in saep-organization.
     */
    function setNodeCompensation(
        string calldata nodeId,
        address occupant,
        inEuint64 memory monthlyRate,
        inEuint64 memory bonusRate,
        inEuint64 memory slaTarget
    ) external onlyTreasuryAdmin {
        HierarchyNodeCompensation storage node = nodeCompensations[nodeId];
        node.nodeId = nodeId;
        node.occupant = occupant;
        node.encryptedMonthlyRate = FHE.asEuint64(monthlyRate);
        node.encryptedBonusRate = FHE.asEuint64(bonusRate);
        node.encryptedSlaTarget = FHE.asEuint64(slaTarget);
        node.isActive = true;

        emit NodeCompensationSet(nodeId, occupant);
    }

    /**
     * @notice Disburse monthly salary or sprint payout based on homomorphic SLA performance verification.
     * @dev Evaluates FHE.gte(encryptedScore, encryptedTarget). If met, streams base + bonus. If not, streams base only.
     * @param nodeId The hierarchy node identifier from saep-organization.
     * @param encryptedPerformanceScore Ciphertext representing the AI agent or employee's performance rating.
     */
    function disburseSprintPayroll(string calldata nodeId, inEuint64 memory encryptedPerformanceScore) external onlyTreasuryAdmin {
        HierarchyNodeCompensation storage node = nodeCompensations[nodeId];
        require(node.isActive, "Hierarchy node compensation is inactive");

        euint64 score = FHE.asEuint64(encryptedPerformanceScore);

        // Homomorphically evaluate SLA: did worker meet or exceed encryptedSlaTarget?
        ebool slaMetEncrypted = FHE.gte(score, node.encryptedSlaTarget);

        // Select bonus allocation in ciphertext: bonus = slaMet ? bonusRate : 0
        euint64 bonusAllocation = FHE.select(slaMetEncrypted, node.encryptedBonusRate, FHE.asEuint64(0));

        // Total payout = monthlyRate + bonusAllocation
        euint64 totalPayout = FHE.add(node.encryptedMonthlyRate, bonusAllocation);

        // Credit recipient's encrypted balance
        if (!FHE.isInitialized(encryptedTreasuryBalance[node.occupant])) {
            encryptedTreasuryBalance[node.occupant] = totalPayout;
        } else {
            encryptedTreasuryBalance[node.occupant] = FHE.add(encryptedTreasuryBalance[node.occupant], totalPayout);
        }

        bool slaDecrypted = FHE.decrypt(slaMetEncrypted);
        emit EncryptedPayrollDisbursed(nodeId, node.occupant, slaDecrypted);
    }

    /**
     * @notice Allow employee or AI Agent node occupant to inspect their encrypted balance.
     */
    function getMyEncryptedBalance(Permission calldata permission) external view onlyPermitted(permission, msg.sender) returns (string memory) {
        return FHE.sealoutput(encryptedTreasuryBalance[msg.sender], permission.publicKey);
    }
}
