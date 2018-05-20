pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Token is StandardToken {
    string public constant name = 'Bonus';
    string public constant symbol = 'BON';
    uint8 public constant decimals = 18;

    uint256 public initialSupply;

    constructor(uint256 _tokens) public {
        uint256 supply = _tokens * (10 ** uint256(decimals));
        initialSupply = supply;

        totalSupply_ = supply;
        balances[msg.sender] = supply;
        emit Transfer(0x0, msg.sender, supply);
    }

    function getInitialSupply() public view returns (uint256) {
        return initialSupply;
    }
}
