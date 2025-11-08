// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventHub {
    struct EventInfo {
        uint256 id;
        address eventAddress;
        address owner;
        string title;
        string[] tags;
        uint256 timestamp;
    }

    uint256 public nextEventId;
    mapping(uint256 => EventInfo) public events;
    mapping(string => uint256[]) private eventsByTag;

    event EventRegistered(
        uint256 indexed id,
        address indexed eventAddress,
        address indexed owner,
        string title
    );

    function registerEvent(
        address _eventAddress,
        address _owner,
        string memory _title,
        string[] memory _tags
    ) external {
        require(_eventAddress != address(0), "Invalid event address");

        EventInfo storage info = events[nextEventId];
        info.id = nextEventId;
        info.eventAddress = _eventAddress;
        info.owner = _owner;
        info.title = _title;
        info.timestamp = block.timestamp;

        for (uint256 i = 0; i < _tags.length; i++) {
            info.tags.push(_tags[i]);
            eventsByTag[_tags[i]].push(nextEventId);
        }

        emit EventRegistered(nextEventId, _eventAddress, _owner, _title);
        nextEventId++;
    }

    function getEvent(uint256 _id) external view returns (EventInfo memory) {
        return events[_id];
    }

    function getEventsByTag(string memory _tag)
        external
        view
        returns (EventInfo[] memory)
    {
        uint256[] memory ids = eventsByTag[_tag];
        EventInfo[] memory result = new EventInfo[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = events[ids[i]];
        }
        return result;
    }

    function getAllEvents() external view returns (EventInfo[] memory) {
        EventInfo[] memory all = new EventInfo[](nextEventId);
        for (uint256 i = 0; i < nextEventId; i++) {
            all[i] = events[i];
        }
        return all;
    }
}
