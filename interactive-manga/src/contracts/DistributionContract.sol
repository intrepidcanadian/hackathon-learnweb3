// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DistributionContract {
    address public owner;
    address[] public contributors;
    mapping(address => uint256) public shares;
    mapping(address => bool) public depositors;

    uint256 public constant OWNER_PERCENTAGE = 80;
    uint256 public constant CONTRIBUTORS_PERCENTAGE = 20;
    uint256 public constant MINIMUM_DEPOSIT = 0.01 ether; 

    constructor() {
        owner = msg.sender;
    }

    function addContributor(address _contributor, uint256 _share) public {
        require(msg.sender == owner, "Only the owner can add contributors");
        require(shares[_contributor] == 0, "Contributor already added");

        contributors.push(_contributor);
        shares[_contributor] = _share;
    }

    function distribute() public payable {
        require(msg.value >= MINIMUM_DEPOSIT, "Minimum deposit is 0.01 ETH"); 

        uint256 totalAmount = msg.value;

        uint256 ownerAmount = (totalAmount * OWNER_PERCENTAGE) / 100;
        payable(owner).transfer(ownerAmount);

        uint256 totalContributorsAmount = (totalAmount * CONTRIBUTORS_PERCENTAGE) / 100;
        uint256 totalShares;
        for (uint i = 0; i < contributors.length; i++) {
            totalShares += shares[contributors[i]];
        }

        for (uint i = 0; i < contributors.length; i++) {
            uint256 contributorAmount = (totalContributorsAmount * shares[contributors[i]]) / totalShares;
            payable(contributors[i]).transfer(contributorAmount);
        }

        depositors[msg.sender] = true;
    }

    function deposit() public payable {
        distribute();
    }

    receive() external payable {
        distribute();
    }

    function hasDeposited(address _address) public view returns (bool) {
        return depositors[_address];
    }
}
