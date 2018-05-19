pragma solidity ^0.4.23;

import "./ChampionSearch.sol";
import "./Token.sol";

contract Hackaton {
    address public conditions;
    address public rewardToken;

    constructor(address _conditions, address _rewardToken) public {
        conditions = _conditions;
        rewardToken = _rewardToken;
    }

    function win(address _certificate)
        external returns(bool)
    {
        bool isCertificateOwner = Certificate(_certificate).checkOwner(msg.sender);

        bool isChampion = ChampionSearch(conditions).check(_certificate);

        uint256 rewardAmount = Token(rewardToken).balanceOf(this);

        require(isCertificateOwner);
        require(isChampion);
        require(rewardAmount > 0);

        Token(rewardToken).transfer(msg.sender, rewardAmount);

        return true;
    }
}
