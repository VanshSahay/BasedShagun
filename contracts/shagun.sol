// contracts/ShagunDistribution.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ShagunDistribution {
    struct Distribution {
        address creator;
        uint256 amountPerRecipient;
        bool verifyBaseName;
        mapping(uint256 => string) baseNames;
        mapping(uint256 => bool) claimed;
        uint256 recipientCount;
    }

    mapping(string => Distribution) public distributions;

    event DistributionCreated(
        string distributionId,
        address creator,
        uint256 amountPerRecipient,
        uint256 recipientCount
    );

    event ShareClaimed(
        string distributionId,
        uint256 recipientIndex,
        address recipient
    );

    function createDistribution(
        string calldata distributionId,
        string[] calldata baseNames,
        bool verifyBaseName
    ) external payable {
        require(baseNames.length > 0, "Must have at least one recipient");
        require(msg.value > 0, "Must send ETH to distribute");

        uint256 amountPerRecipient = msg.value / baseNames.length;

        Distribution storage dist = distributions[distributionId];
        require(dist.creator == address(0), "Distribution ID already exists");

        dist.creator = msg.sender;
        dist.amountPerRecipient = amountPerRecipient;
        dist.verifyBaseName = verifyBaseName;
        dist.recipientCount = baseNames.length;

        // Store base names individually
        for (uint256 i = 0; i < baseNames.length; i++) {
            dist.baseNames[i] = baseNames[i];
        }

        emit DistributionCreated(
            distributionId,
            msg.sender,
            amountPerRecipient,
            baseNames.length
        );
    }

    function claimShare(
        string calldata distributionId,
        uint256 recipientIndex,
        string calldata baseName
    ) external {
        Distribution storage dist = distributions[distributionId];
        require(dist.creator != address(0), "Distribution does not exist");
        require(!dist.claimed[recipientIndex], "Share already claimed");
        require(
            recipientIndex < dist.recipientCount,
            "Invalid recipient index"
        );

        if (dist.verifyBaseName) {
            require(
                keccak256(abi.encodePacked(dist.baseNames[recipientIndex])) ==
                    keccak256(abi.encodePacked(baseName)),
                "Invalid base name"
            );
        }

        dist.claimed[recipientIndex] = true;

        (bool success, ) = payable(msg.sender).call{
            value: dist.amountPerRecipient
        }("");
        require(success, "Transfer failed");

        emit ShareClaimed(distributionId, recipientIndex, msg.sender);
    }

    function getBaseName(
        string calldata distributionId,
        uint256 index
    ) external view returns (string memory) {
        Distribution storage dist = distributions[distributionId];
        require(dist.creator != address(0), "Distribution does not exist");
        require(index < dist.recipientCount, "Invalid index");
        return dist.baseNames[index];
    }

    function getDistributionInfo(
        string calldata distributionId
    )
        external
        view
        returns (
            address creator,
            uint256 amountPerRecipient,
            bool verifyBaseName,
            uint256 recipientCount
        )
    {
        Distribution storage dist = distributions[distributionId];
        require(dist.creator != address(0), "Distribution does not exist");
        return (
            dist.creator,
            dist.amountPerRecipient,
            dist.verifyBaseName,
            dist.recipientCount
        );
    }

    function isShareClaimed(
        string calldata distributionId,
        uint256 index
    ) external view returns (bool) {
        Distribution storage dist = distributions[distributionId];
        require(dist.creator != address(0), "Distribution does not exist");
        require(index < dist.recipientCount, "Invalid index");
        return dist.claimed[index];
    }
}
