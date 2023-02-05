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

        require(checkCandidate(_id, _candidate), "This candidates does not exist in this voting!");

        Voting[_id].candidates[_candidate].balance += msg.value;
        Voting[_id].Bank += msg.value;

        if (Voting[_id].candidates[_candidate].balance > Voting[_id].WinnerBalance) {
            Voting[_id].WinnerBalance = Voting[_id].candidates[_candidate].balance;
            Voting[_id].Winner = _candidate;
        }
    }

    function withDrawPrize(uint _id) public {
        require(Voting[_id].started, "The voting doesn't start!");
        require(Voting[_id].StartDate + Voting[_id].Period < block.timestamp, "The voting is not ended yet!");
        require(msg.sender == Voting[_id].Winner, "You are not a winner!");
        require(Voting[_id].Bank > 0, "You have already receive your prize!");

        uint amount = Voting[_id].Bank;
        uint ownerComission = (Comission * amount) / 100;
        uint clearAmount = amount - ownerComission;
        Voting[_id].Bank = 0;
        payable(owner).transfer(ownerComission);
        payable(msg.sender).transfer(clearAmount);
    }

    function checkCandidate(address _candidate, uint _id) public view returns(bool) {
        return(Voting[_id].Candidates[_candidate].isExistOnThisVoting);
    }

    function getVotingInfo(uint256 _id) public view returns (
        bool,
        uint256,
        uint256,
        uint256,
        uint256,
        address
        ) {
            return(
                Voting[_id].started,
                Voting[_id].StartDate,
                Voting[_id].WinnerBalance,
                Voting[_id].Bank,
                Voting[_id].Period,
                Voting[_id].Winner);
        }



    event candidateInfo(uint indexed id, address indexed candidate, bool existOnThisVoting);

    event votingDraftCreated(uint indexed id);

    event votingStarted(uint indexed id, uint startDate);
}