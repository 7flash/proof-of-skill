pragma solidity ^0.4.23;

contract Certificate {
    string public description;
    string public metadata;

    address public owner;

    mapping (address => bool) public confirmedBy;

    address[] public confirmations;

    function Certificate(address _owner, string _description) public {
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
        require(!isConfirmedBy(msg.sender));

        confirmedBy[msg.sender] = true;
        confirmations.push(msg.sender);

        return true;
    }

    function isConfirmedBy(address _oracle)
        public constant returns (bool)
    {
        return confirmedBy[_oracle];
    }

    function checkOwner(address _addr)
        public constant returns (bool)
    {
        return owner == _addr;
    }
}