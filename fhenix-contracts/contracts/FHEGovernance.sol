// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

/**
 * @title FHEGovernance — Confidential Boardroom & AI Executive Governance
 * @notice Solves the enterprise problem where transparent public voting on corporate actions
 * (M&A, C-Suite restructuring, AI Governor overrides) exposes internal board dissent and triggers
 * market manipulation or competitor espionage.
 * @dev Powered by Fhenix FHE EVM for Kyrti saep-governance & saep-organization.
 */
contract FHEGovernance is Permissioned {
    struct Proposal {
        uint256 id;
        string description;
        uint256 deadline;
        euint64 totalYesWeight;
        euint64 totalNoWeight;
        bool isResolved;
        bool finalOutcome;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) private proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // Encrypted voting shares held by C-Suite executives or Autonomous AI Governors
    mapping(address => euint64) private executiveShares;

    event ProposalCreated(uint256 indexed proposalId, string description, uint256 deadline);
    event EncryptedVoteCast(uint256 indexed proposalId, address indexed voter);
    event ProposalResolved(uint256 indexed proposalId, bool isApproved);

    modifier onlyBeforeDeadline(uint256 proposalId) {
        require(block.timestamp <= proposals[proposalId].deadline, "Voting period has ended");
        _;
    }

    modifier onlyAfterDeadline(uint256 proposalId) {
        require(block.timestamp > proposals[proposalId].deadline, "Voting period active");
        _;
    }

    /**
     * @notice Assign encrypted governance shares to an executive or AI Governor node.
     * @param executive Address of the human C-Suite executive or AI Agent node.
     * @param encryptedShares Ciphertext representing the executive's weighted voting shares.
     */
    function assignExecutiveShares(address executive, inEuint64 memory encryptedShares) external {
        euint64 shares = FHE.asEuint64(encryptedShares);
        executiveShares[executive] = shares;
    }

    /**
     * @notice Create a new boardroom proposal for confidential voting.
     */
    function createProposal(string calldata description, uint256 durationSeconds) external returns (uint256) {
        proposalCount++;
        uint256 pid = proposalCount;

        Proposal storage p = proposals[pid];
        p.id = pid;
        p.description = description;
        p.deadline = block.timestamp + durationSeconds;
        p.totalYesWeight = FHE.asEuint64(0);
        p.totalNoWeight = FHE.asEuint64(0);

        emit ProposalCreated(pid, description, p.deadline);
        return pid;
    }

    /**
     * @notice Cast an encrypted boardroom vote (inFavor / against) weighted by encrypted shares.
     * @dev Homomorphically tallies votes without revealing vote direction or margins to validator nodes.
     * @param proposalId The ID of the corporate governance proposal.
     * @param encryptedVote Ciphertext boolean (true = In Favor, false = Against).
     */
    function castEncryptedVote(uint256 proposalId, inEbool memory encryptedVote) external onlyBeforeDeadline(proposalId) {
        require(!hasVoted[proposalId][msg.sender], "Executive has already voted on this proposal");
        require(FHE.isInitialized(executiveShares[msg.sender]), "Caller holds no executive shares");

        hasVoted[proposalId][msg.sender] = true;

        ebool inFavor = FHE.asEbool(encryptedVote);
        euint64 voterWeight = executiveShares[msg.sender];

        Proposal storage p = proposals[proposalId];

        // Homomorphic conditional accumulation:
        // if inFavor == true: totalYesWeight += voterWeight
        // if inFavor == false: totalNoWeight += voterWeight
        euint64 yesContribution = FHE.select(inFavor, voterWeight, FHE.asEuint64(0));
        euint64 noContribution = FHE.select(inFavor, FHE.asEuint64(0), voterWeight);

        p.totalYesWeight = FHE.add(p.totalYesWeight, yesContribution);
        p.totalNoWeight = FHE.add(p.totalNoWeight, noContribution);

        emit EncryptedVoteCast(proposalId, msg.sender);
    }

    /**
     * @notice Resolve proposal outcome after voting ends.
     * @dev Compares encrypted totals and decrypts ONLY the boolean pass/fail outcome. Exact vote margins remain hidden forever.
     */
    function resolveProposal(uint256 proposalId) external onlyAfterDeadline(proposalId) {
        Proposal storage p = proposals[proposalId];
        require(!p.isResolved, "Proposal already resolved");

        ebool isApprovedEncrypted = FHE.gt(p.totalYesWeight, p.totalNoWeight);
        
        // Decrypt only the final binary pass/fail decision
        bool outcome = FHE.decrypt(isApprovedEncrypted);
        p.isResolved = true;
        p.finalOutcome = outcome;

        emit ProposalResolved(proposalId, outcome);
    }

    /**
     * @notice Allow an executive to verify their encrypted shares using a sealed read.
     */
    function getSealedShares(Permission calldata permission) external view onlyPermitted(permission, msg.sender) returns (string memory) {
        return FHE.sealoutput(executiveShares[msg.sender], permission.publicKey);
    }
}
