// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PublicEvent {
    string public title;
    string public location;
    uint256 public maxAttendees;
    address public owner;
    string public description;
    string[] public tags;
    uint256 public createdAt;
    uint256 public startsAt;
    uint256 public endsAt;
    uint256 public attendeesCount;
    bool public eventEnded = false;
    bool public eventCanceled = false;

    mapping(address => bool) public isAttendee;
    mapping(address => bool) public isStaff;

    modifier onlyBeforeEventStarts() {
        require(block.timestamp < startsAt, "Event already started");
        require(!eventCanceled, "Event is cancelled");
        _;
    }

    modifier onlyStaff() {
        require(msg.sender == owner || isStaff[msg.sender], "You're not staff");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    event AttendeeJoined(address attendee, uint256 timestamp);
    event AttendeeLeft(address attendee, uint256 timestamp);

    constructor(
        string memory _title,
        string memory _location,
        uint256 _maxAttendees,
        string memory _description,
        string[] memory _tags,
        address _owner,
        uint256 _startsAt,
        uint256 _endsAt
    ) {
        require(bytes(_title).length > 0, "Empty title");
        require(bytes(_location).length > 0, "Empty address");
        require(_maxAttendees > 0, "Attendees must be > 0");
        require(_owner != address(0), "Owner cannotzero");
        require(_startsAt > block.timestamp, "Event must be in the future");
        require(_endsAt > _startsAt, "Event ending must be after event starting");
        require(_tags.length <= 5, "Too many tags, max 5");

        title = _title;
        location = _location;
        maxAttendees = _maxAttendees;
        description = _description;
        owner = _owner;
        createdAt = block.timestamp;
        startsAt = _startsAt;
        endsAt = _endsAt; 
        tags = new string[](_tags.length);
        for (uint256 i = 0; i < _tags.length; i++) {
            tags[i] = _tags[i];
        }
    }

    // -------- User functions --------

    function joinEvent() external onlyBeforeEventStarts {
        require(attendeesCount < maxAttendees, "Event is full");
        require(!isAttendee[msg.sender], "You're already attending");

        attendeesCount += 1;
        isAttendee[msg.sender] = true;
    }

    function leaveEvent() external onlyBeforeEventStarts {
        require(isAttendee[msg.sender], "You're not attending this event");
        require(attendeesCount > 0, "No attendees");

        attendeesCount -= 1;
        isAttendee[msg.sender] = false;
    }

    // ---------------------------------

    // -------- Staff functions --------

    function addAttendee(address _attendee) external onlyStaff {
        require(!isAttendee[_attendee], "Attendee already added");
        require(attendeesCount < maxAttendees, "Event is full");
        
        attendeesCount += 1;
        isAttendee[_attendee] = true;
    }

    function removeAttendee(address _attendee) external onlyStaff {
        require(isAttendee[_attendee], "Not attending");
        require(attendeesCount > 0, "No attendees");
        
        attendeesCount -= 1;
        isAttendee[_attendee] = false;
    }

    function endEvent() external onlyStaff {
        require(!eventEnded, "Event already finished");
        require(block.timestamp >= startsAt, "Event not started yet");

        eventEnded = true;
    }

    function cancelEvent() external onlyStaff {
        require(block.timestamp < startsAt, "Event already started, use finishEvent instead");
        
        eventCanceled = true;
        eventEnded = true;
    }

    // ---------------------------------

    // -------- Owner functions --------
    
    function addStaff(address _newStaff) external onlyOwner {
        isStaff[_newStaff] = true;
    }

    function removeStaff(address _staff) external onlyOwner {
        isStaff[_staff] = false;
    }

    // ---------------------------------
    
    function checkAttendee(address _joiner) external view returns (bool) {
        return isAttendee[_joiner];
    }

    function getTags() external view returns (string[] memory) {
        return tags;
    }
}
