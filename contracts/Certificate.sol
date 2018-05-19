pragma solidity ^0.4.23;

contract Certificate {
    string public description;
    address public owner;

    mapping (address => bool) public confirmedBy;

    address[] public confirmations;

    function Certificate(address _owner, string _description) public {
        owner = _owner;
        description = _description;
    }

    function confirm()
        public
    {
        require(!isConfirmedBy(msg.sender));

        confirmedBy[msg.sender] = true;
        confirmations.push(msg.sender);
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