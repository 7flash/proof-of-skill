pragma solidity ^0.4.23;

import "./CharityFundCheck.sol";
import "./Token.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";

contract CharityFund {
    address public conditions;
    address public charityToken;

    event Funded(address certificate, uint256 tokens);
    event Claimed(address certificate);

    constructor(address _conditions, address _charityToken) public {
        conditions = _conditions;
        charityToken = _charityToken;
    }

    function fund(address _certificate, uint256 _tokens) {
        require(Certificate(_certificate).getNumberOfConfirmations() > 0);
        Token(charityToken).transfer(address(this), _tokens);
        CherityFundCheck(conditions).fund(_certificate, _tokens);
        emit Funded(_certificate, _tokens);
    }

    function claim(address _certificate)
        external returns(bool)
    {
        bool isCertificateOwner = Certificate(_certificate).checkOwner(msg.sender);
        Token token = Token(charityToken);

        require(isCertificateOwner);

        token.transfer(msg.sender, certificateFunds[_certificate]);
        CherityFundCheck(conditions).resetFunds(_certificate);

        emit Claimed(_certificate);

        return true;
    }
}
