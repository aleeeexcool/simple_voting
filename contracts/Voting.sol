// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./IVoting.sol";

contract Voting is IVoting {
 
    address public owner;
    uint public counter;
    uint public maxCandidates;
    uint8 public immutable Comission; 

    struct Candidate {
        uint balance;
        bool isExistOnThisVoting;
    }

    struct Voting {
        bool started;
        address Winner;
        uint StartDate;
        uint WinnerBalance;
        uint Bank;
        uint Period;
        mapping(address => Candidate) Candidates;
    }

    mapping(uint => Voting) private Votings;

    modifier onlyOwner() {
        require(msg.sender == owner, "Sorry, but you are not an owner!");
        _;
    }

    constructor(uint _maxCandidates, uint8 _comission) {
        owner = msg.sender;
        Comission = _comission;
        maxCandidates = _maxCandidates;
    }

}