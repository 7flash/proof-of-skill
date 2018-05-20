pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ECRecovery.sol";

contract Certificate {
    using ECRecovery for bytes32;

    string public description;
    string public metadata;

    address public owner;

    mapping (address => bool) public confirmedBy;

    address[] public confirmations;

    constructor(address _owner, string _description) public {
        owner = _owner;
        description = _description;
    }

    function changeMetadata(string _metadata)
        external returns(bool)
    {
        require(checkOwner(msg.sender));

        metadata = _metadata;

        return true;
    }

    function confirm()
        external returns(bool)
    {
        confirmInternal(msg.sender);

        return true;
    }

    function confirmFrom(address _oracle, bytes sig)
        public returns(bool)
    {
        require(_oracle != msg.sender);

        bytes32 message = sha3(address(this)).toEthSignedMessageHash();

        require(message.recover(sig) == _oracle);

        confirmInternal(_oracle);

        return true;
    }

    function confirmInternal(address _oracle)
        internal
    {
        require(confirmedBy[_oracle] == false);

        confirmedBy[_oracle] = true;
        confirmations.push(_oracle);
    }

    function isConfirmedBy(address _oracle)
        public constant returns (bool)
    {
        return confirmedBy[_oracle];
    }

    function getNumberOfConfirmations() public constant returns(uint count) {
        return confirmations.length;
    }

    function checkOwner(address _addr)
        public constant returns (bool)
    {
        return owner == _addr;
    }
}
