// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FlintEventHub.sol";
import "./FlintPaidPublicEvent.sol";

contract PaidPublicEventFactory {
    EventHub public hub;
    address public owner;
    uint256 public defaultTicketPriceUSD;

    address public usdc;
    address public usdt;
    address public ethUsdPriceFeed;

    event PaidEventCreated(address indexed eventAddress, address indexed creator, string title);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event HubContractUpdated(address indexed oldHub, address indexed newHub);
    event DefaultPriceUpdated(uint256 newPrice);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(
        address _hubAddress,
        address _usdc,
        address _usdt,
        address _ethUsdPriceFeed,
        uint256 _defaultTicketPriceUSD
    ) {
        require(_hubAddress != address(0), "Invalid hub address");
        hub = EventHub(_hubAddress);
        owner = msg.sender;
        usdc = _usdc;
        usdt = _usdt;
        ethUsdPriceFeed = _ethUsdPriceFeed;
        defaultTicketPriceUSD = _defaultTicketPriceUSD;
    }

    function createPaidEvent(
        string memory _title,
        string memory _location,
        uint256 _maxAttendees,
        string memory _description,
        string[] memory _tags,
        uint256 _startsAt,
        uint256 _endsAt,
        uint256 _ticketPriceUSD
    ) external {
        uint256 price = _ticketPriceUSD == 0 ? defaultTicketPriceUSD : _ticketPriceUSD;

        PaidPublicEvent newEvent = new PaidPublicEvent(
            _title,
            _location,
            _maxAttendees,
            _description,
            _tags,
            msg.sender,
            _startsAt,
            _endsAt,
            usdc,
            usdt,
            ethUsdPriceFeed,
            price
        );

        hub.registerEvent(address(newEvent), msg.sender, _title, _tags);

        emit PaidEventCreated(address(newEvent), msg.sender, _title);
    }

    function editHubContract(address _newHub) external onlyOwner {
        require(_newHub != address(0), "Invalid new hub address");
        address oldHub = address(hub);
        hub = EventHub(_newHub);
        emit HubContractUpdated(oldHub, _newHub);
    }

    function setDefaultTicketPriceUSD(uint256 _newPrice) external onlyOwner {
        defaultTicketPriceUSD = _newPrice;
        emit DefaultPriceUpdated(_newPrice);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        address prev = owner;
        owner = _newOwner;
        emit OwnershipTransferred(prev, _newOwner);
    }
}
