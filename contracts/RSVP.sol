pragma solidity ^0.4.21;


contract RSVP {
    string public eventName;
    uint256 public minDeposit; // variable to hold the required minimum deposit
    address public owner; // variable to hold who the owner of the contract is (only the owner can refund the deposit - this stops people from calling the refund function if they are not at the event)

    struct userData {
        uint256 value;
        bool refunded;
        string nickname;
    }

    uint public attendeeCount;
    uint public maxAttendees;

    mapping (address => userData) public balances; // mapping that stores who and how much ETH was put into the contract

    event Staked(address indexed beneficiary, string nickname, uint256 value); // Log of the deposit
    event Redeemed(address indexed recipient, uint256 value); // Log of the redemption
    event Destoryed(); // Log of the selfdestruct


    // RSVP constructor - this can only be called once on creation (usually used to set the initial state of the contract)
    function RSVP(uint256 _minDeposit, string _eventName, uint _maxAttendees, address _owner) public {
        require(_minDeposit > 0); // making sure the deposit is not 0
        owner = _owner; // setting the owner of the contract to the creator of the contract
        eventName = _eventName;
        minDeposit = _minDeposit; // setting the minimum deposit amount
        maxAttendees = _maxAttendees;
    }

    // This will fire when someone sends ETH to this contract
    function () external payable {
        rsvp(""); //Give it a function that you want to execute
    }

    function register(string _nickname) external payable {
        rsvp(_nickname);
    }

    //this will refund the deposited ETH which can only be executed by the contract owner or meetup organizer
    function refund(address _recipient) public {
        require(owner == msg.sender); // making sure the initiator is the owner
        require(_recipient != address(0)); // making sure the recipient is not the 0 address

        _recipient.transfer(balances[_recipient].value); // return staked ETH to recipient

        emit Redeemed(_recipient, balances[_recipient].value); // emit abn event to record to event log

        attendeeCount -= 1;
        balances[_recipient].refunded = true;
        balances[_recipient].value = 0; // zero out our mapping after sending the ETH
    }

    function kill() public {
        require(msg.sender == owner);
        emit Destoryed();
        selfdestruct(owner);
    }

    // The function we want executed when someone sends ETH to this contract
    function rsvp(string _name) internal {
        require(msg.value >= minDeposit); // acts like a modifier to make sure it is greater or equal to the min
        require(balances[msg.sender].refunded == false);
        balances[msg.sender].nickname = _name;
        balances[msg.sender].value = balances[msg.sender].value + msg.value; // update our mapping to remember how much this user sent to the contract

        attendeeCount += 1;
        require(attendeeCount <= maxAttendees);
        emit Staked(msg.sender, balances[msg.sender].nickname, balances[msg.sender].value); // emit an event to record in event log
    }
}
