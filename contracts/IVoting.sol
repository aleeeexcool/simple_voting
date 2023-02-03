// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract IVoting {
 
    function addVoting(address[] calldata _candidates, uint _period) public {}

    function addCandidate(address _candidate, uint _id) public {}

    function deleteCandidate(address _candidate, uint _id) public {}

    function takePartInVoting(uint _id, address _candidate) public {}

    function withDrawMoney(uint _id) public {}

    function checkCandidate(address _candidate, uint _id) public view returns(bool) {}

    function getVotingInfo(uint256 _votingID) public view returns (
            bool,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        ) {}

    function startVoting(uint _id) public {}

    function editVotingPeriod(uint _id, uint _newPeriod) public {}

    function setMaxAndMinCandidates(uint _maxCandidates) public {}

    event candidateInfo(uint indexed id, address indexed candidate, bool existOnThisVoting);

    event votingDraftCreated(uint indexed id);

    event votingStarted(uint indexed id, uint startDate);
}