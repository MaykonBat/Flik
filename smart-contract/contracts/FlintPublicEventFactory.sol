// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FlintEventHub.sol";
import "./FlintPublicEvent.sol";

contract PublicEventFactory {
    EventHub public hub;
    address public owner;

    event PublicEventCreated(address indexed eventAddress, address indexed owner, string title);
    event HubContractUpdated(address indexed oldHub, address indexed newHub);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
            require(msg.sender == owner, "Not the owner");
            _;
        }

    constructor(address _hubAddress) {
        require(_hubAddress != address(0), "Invalid hub address");
        hub = EventHub(_hubAddress);
        owner = msg.sender;
    }

    function createPublicEvent(
        string memory _title,
        string memory _location,
        uint256 _maxAttendees,
        string memory _description,
        string[] memory _tags,
        uint256 _startsAt,
        uint256 _endsAt
    ) external {
        PublicEvent newEvent = new PublicEvent(
            _title,
            _location,
            _maxAttendees,
            _description,
            _tags,
            msg.sender,
            _startsAt,
            _endsAt
        );

        hub.registerEvent(address(newEvent), msg.sender, _title, _tags);

        emit PublicEventCreated(address(newEvent), msg.sender, _title);
    }

    /// @notice Changes the hub contract address
    function editHubContract(address _newHub) external onlyOwner {
        require(_newHub != address(0), "Invalid new hub address");
        address oldHub = address(hub);
        hub = EventHub(_newHub);
        emit HubContractUpdated(oldHub, _newHub);
    }

    /// @notice Transfers ownership to another address
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        address previousOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(previousOwner, _newOwner);
    }
}
