pragma solidity ^0.4.23;

import "./EligibilityCheck.sol";
import "./Token.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";

contract Charity {
    address public conditions;
    address public charityToken;

    constructor(address _conditions, address _charityToken) public {
        conditions = _conditions;
        charityToken = _charityToken;
    }

    function claim(address _certificate)
        external returns(bool)
    {
        bool isCertificateOwner = Certificate(_certificate).checkOwner(msg.sender);
        EligibilityCheck eligibility = EligibilityCheck(conditions);
        bool isEligible = eligibility.check(_certificate);
        Token token = Token(charityToken);
        uint256 charityAmount = token.balanceOf(this);

        require(isCertificateOwner);
        require(isEligible);
        require(charityAmount > 0);

        uint256 transferAmount = uint256(token.getInitialSupply() /
          (eligibility.getNumberOfEligibleCertificates() * 10 ** uint256(token.decimals())));

        token.transfer(msg.sender, transferAmount);

        return true;
    }
}
