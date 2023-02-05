// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Voting {
 
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

    function addVoting(address[] calldata _candidates, uint _period) public onlyOwner {
        require(_candidates.length < maxCandidates, "Too many candidates");
        Voting[counter].Period = _period; 
        for( uint i = 0; i < _candidates.length; i++) {
            addCandidate(counter, _candidates[i]);


        }
        emit votingDraftCreated(counter);
        counter++;
    }

    function addCandidate(address _candidate, uint _id) public onlyOwner {
        require(Voting[_id].started, "The voting has already begun!");
        Voting[_id].Candidates[_candidate].isExistOnThisVoting = true;
        emit candidateInfo(_id, _candidate, true);
    }

    function deleteCandidate(address _candidate, uint _id) public onlyOwner {
        require(Voting[_id].started, "The voting has already begun!");
        Voting[_id].Candidates[_candidate].isExistOnThisVoting = false;
        emit candidateInfo(_id, _candidate, false);
    }

    function takePartInVoting(uint _id, address _candidate) public payable {
        require(Voting[_id].started, "The voting doesn't start!");
        require(Voting[_id].StartDate + Voting[_id].Period > block.timestamp, "The voting has ended!");


    }


    event candidateInfo(uint indexed id, address indexed candidate, bool existOnThisVoting);

    event votingDraftCreated(uint indexed id);

    event votingStarted(uint indexed id, uint startDate);
}