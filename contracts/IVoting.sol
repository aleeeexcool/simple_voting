// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IVoting {
 
    function addVoting(address[] calldata _candidates, uint _period) external;

    function addCandidate(address _candidate, uint _id) external;

    function deleteCandidate(address _candidate, uint _id) external;

    function takePartInVoting(uint _id, address _candidate) external payable;

    function withDrawPrize(uint _id) external;

    function checkCandidate(address _candidate, uint _id) external view returns(bool);

    function getVotingInfo(uint256 _id) external view returns (
        bool,
        uint256,
        uint256,
        uint256,
        uint256,
        address
        );

    function startVoting(uint _id) external;

    function editVotingPeriod(uint _id, uint _newPeriod) external;

    function setMaxCandidates(uint _maxCandidates) external;

    event candidateInfo(uint id, address candidate, bool existOnThisVoting);

    event votingDraftCreated(uint id);

    event votingStarted(uint id, uint startDate);
}