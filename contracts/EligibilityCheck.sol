pragma solidity ^0.4.23;

import "./Certificate.sol";

contract EligibilityCheck {
    address admin;

    address[] public oracles;
    address[] public certificates;

    uint256 public numberOfEligibleCertificates;

    bool public votingHasEnded = false;

    constructor(address[] _oracles, address[] _certificates) public {
        oracles = _oracles;
        certificates = _certificates;

        admin = msg.sender;

    }

    function finalizeVoting() private {
        uint256 count = 0;
        for(uint256 i = 0; i < certificates.length; i++) {
            if (Certificate(certificates[i]).getNumberOfConfirmations() > 0) {
                count = count + 1;
            }
        }
        numberOfEligibleCertificates = count;
    }

    function check(address _certificate)
        public constant returns (bool)
    {
        require(votingHasEnded == true);

        for(uint256 i = 0; i < certificates.length; i++) {
            if (certificates[i] == _certificate && Certificate(_certificate).getNumberOfConfirmations() > 0) {
                return true;
            }
        }
        return false;
    }


    function finishVoting()
        external returns (bool)
    {
        require(admin == msg.sender);
        require(votingHasEnded == false);

        finalizeVoting();

        votingHasEnded = true;
    }

    function getNumberOfEligibleCertificates() public view returns (uint256) {
        return numberOfEligibleCertificates;
    }

}
