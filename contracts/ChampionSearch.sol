pragma solidity ^0.4.23;

import "./Certificate.sol";

contract ChampionSearch {
    address admin;

    address[] public oracles;
    address[] public certificates;

    address champion;
    uint256 championRating = 0;

    bool public votingHasEnded = false;

    function ChampionSearch(address[] _oracles, address[] _certificates) {
        oracles = _oracles;
        certificates = _certificates;

        admin = msg.sender;
    }

    function finalizeVoting() private {
      uint256 maxRating = 0;

      for(uint256 i = 0; i < certificates.length; i++) {
          uint256 currentRating = 0;

          for(uint256 j = 0; j < oracles.length; j++) {
              if(Certificate(certificates[i]).isConfirmedBy(oracles[j])) {
                  currentRating++;
              }
          }

          if(currentRating > maxRating) {
              championRating = currentRating;
              champion = certificates[i];
          }
      }
    }

    function check(address _certificate)
        public constant returns (bool)
    {
        require(votingHasEnded == true);

        if(_certificate == champion) {
            return true;
        } else {
            return false;
        }
    }

    function finishVoting()
        external returns (bool)
    {
        require(admin == msg.sender);
        require(votingHasEnded == false);

        finalizeVoting();

        votingHasEnded = true;
    }
}
