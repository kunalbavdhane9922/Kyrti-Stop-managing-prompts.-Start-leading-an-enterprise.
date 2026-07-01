// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

/**
 * @title FHEMarketplace — Blind Sealed-Bid AI Workforce Marketplace
 * @notice Solves the enterprise problem where acquiring specialized AI models or human contractors
 * on public block explorers exposes strategic roadmaps, urgency, and financial limits to competitors.
 * @dev Powered by Fhenix FHE EVM for Kyrti saep-marketplace & saep-workforce.
 */
contract FHEMarketplace is Permissioned {
    struct WorkforceListing {
        uint256 listingId;
        string roleTitle;
        string aiModelTier;
        uint256 biddingDeadline;
        euint64 highestBidEncrypted;
        address currentWinner;
        bool isClosed;
    }

    uint256 public listingCount;
    mapping(uint256 => WorkforceListing) private listings;
    
    // Encrypted bid history per bidder for sealed verification
    mapping(uint256 => mapping(address => euint64)) private bidderBids;

    event ListingCreated(uint256 indexed listingId, string roleTitle, string aiModelTier, uint256 deadline);
    event SealedBidSubmitted(uint256 indexed listingId, address indexed bidder);
    event MarketplaceClosed(uint256 indexed listingId, address indexed winningBidder);

    modifier onlyActiveListing(uint256 listingId) {
        require(block.timestamp <= listings[listingId].biddingDeadline, "Bidding window has expired");
        require(!listings[listingId].isClosed, "Listing is closed");
        _;
    }

    /**
     * @notice Publish a new workforce node listing for sealed encrypted bidding.
     */
    function createWorkforceListing(string calldata roleTitle, string calldata aiModelTier, uint256 durationSeconds) external returns (uint256) {
        listingCount++;
        uint256 lid = listingCount;

        WorkforceListing storage item = listings[lid];
        item.listingId = lid;
        item.roleTitle = roleTitle;
        item.aiModelTier = aiModelTier;
        item.biddingDeadline = block.timestamp + durationSeconds;
        item.highestBidEncrypted = FHE.asEuint64(0);

        emit ListingCreated(lid, roleTitle, aiModelTier, item.biddingDeadline);
        return lid;
    }

    /**
     * @notice Submit a zero-knowledge encrypted sealed bid for an AI or human workforce contractor.
     * @dev Evaluates highest bid homomorphically in ciphertext using FHE.gt() and FHE.select().
     * @param listingId ID of the workforce position listing.
     * @param encryptedBid Ciphertext representing the bidder's financial bid offer.
     */
    function submitSealedBid(uint256 listingId, inEuint64 memory encryptedBid) external onlyActiveListing(listingId) {
        euint64 newBid = FHE.asEuint64(encryptedBid);
        WorkforceListing storage item = listings[listingId];

        // Store bidder's bid for their own sealed read later
        bidderBids[listingId][msg.sender] = newBid;

        // Homomorphically evaluate if newBid > highestBidEncrypted
        ebool isNewHighest = FHE.gt(newBid, item.highestBidEncrypted);

        // Update highest bid in ciphertext: highestBid = isNewHighest ? newBid : highestBid
        item.highestBidEncrypted = FHE.select(isNewHighest, newBid, item.highestBidEncrypted);

        // Notice: If we decrypt only the boolean isNewHighest, we can update currentWinner without leaking bid amounts!
        bool becameLeader = FHE.decrypt(isNewHighest);
        if (becameLeader) {
            item.currentWinner = msg.sender;
        }

        emit SealedBidSubmitted(listingId, msg.sender);
    }

    /**
     * @notice Finalize the sealed-bid auction once the deadline expires.
     */
    function finalizeAuction(uint256 listingId) external {
        WorkforceListing storage item = listings[listingId];
        require(block.timestamp > item.biddingDeadline, "Bidding is still ongoing");
        require(!item.isClosed, "Already finalized");

        item.isClosed = true;
        emit MarketplaceClosed(listingId, item.currentWinner);
    }

    /**
     * @notice Allow enterprise bidders to view their submitted encrypted bid via Fhenix permission.
     */
    function getMySealedBid(uint256 listingId, Permission calldata permission) external view onlyPermitted(permission, msg.sender) returns (string memory) {
        return FHE.sealoutput(bidderBids[listingId][msg.sender], permission.publicKey);
    }
}
