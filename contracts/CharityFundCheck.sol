pragma solidity ^0.4.23;

import "./Certificate.sol";

contract CherityFundCheck {
    address admin;

    address[] public oracles;
    address[] public certificates;

    mapping(address => uint256) certificateFunds;

    constructor(address[] _oracles, address[] _certificates) public {
        oracles = _oracles;
        certificates = _certificates;

        admin = msg.sender;

    }

    function fund(address _certificate, uint256 _tokens) external {
        require(msg.sender == admin);
        certificateFunds[_certificate] += _tokens;
    }

    function check(address _certificate)
        public constant returns (bool)
    {
        return certificateFunds[_certificate] > 0;
    }

    function resetFunds(address _certificate) external {
        require(msg.sender == admin);
        certificateFunds[_certificate] = 0;
    }

}
