// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FlintEventHub.sol";
import "side_contracts/MockV3Aggregator.sol"; //"@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaidPublicEvent {
    string public title;
    string public location;
    string public description;
    string[] public tags;
    uint256 public maxAttendees;
    address public owner;
    uint256 public startsAt;
    uint256 public endsAt;
    uint256 public ticketPriceUSD; // price in USD (18 decimals)
    uint256 public attendeeCount;
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

    IERC20 public usdc;
    IERC20 public usdt;
    MockV3Aggregator public ethUsdPriceFeed;

    event Joined(address indexed user, string title);
    event Withdraw(address indexed owner, uint256 amount);

    constructor(
        string memory _title,
        string memory _location,
        uint256 _maxAttendees,
        string memory _description,
        string[] memory _tags,
        address _owner,
        uint256 _startsAt,
        uint256 _endsAt,
        address _usdc,
        address _usdt,
        address _ethUsdPriceFeed,
        uint256 _ticketPriceUSD
    ) {
        title = _title;
        location = _location;
        maxAttendees = _maxAttendees;
        description = _description;
        tags = _tags;
        owner = _owner;
        startsAt = _startsAt;
        endsAt = _endsAt;

        usdc = IERC20(_usdc);
        usdt = IERC20(_usdt);
        ethUsdPriceFeed = MockV3Aggregator(_ethUsdPriceFeed);
        ticketPriceUSD = _ticketPriceUSD * 1e18; // normalize to 18 decimals
    }

    function joinWithETH() external payable {
        require(!isAttendee[msg.sender], "Already joined");
        require(attendeeCount < maxAttendees, "Full");

        uint256 requiredETH = getETHAmountForUSD(ticketPriceUSD);
        require(msg.value >= requiredETH, "Insufficient ETH");

        isAttendee[msg.sender] = true;
        attendeeCount++;
        emit Joined(msg.sender, title);
    }

    function joinWithUSDC() external {
        require(!isAttendee[msg.sender], "Already joined");
        require(attendeeCount < maxAttendees, "Full");

        uint256 amount = ticketPriceUSD / 1e12; // USDC 6 decimals
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        isAttendee[msg.sender] = true;
        attendeeCount++;
        emit Joined(msg.sender, title);
    }

    function joinWithUSDT() external {
        require(!isAttendee[msg.sender], "Already joined");
        require(attendeeCount < maxAttendees, "Full");

        uint256 amount = ticketPriceUSD / 1e12; // USDT 6 decimals
        require(usdt.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        isAttendee[msg.sender] = true;
        attendeeCount++;
        emit Joined(msg.sender, title);
    }

    function withdraw() external onlyOwner {
        uint256 ethBalance = address(this).balance;
        uint256 usdcBalance = usdc.balanceOf(address(this));
        uint256 usdtBalance = usdt.balanceOf(address(this));

        if (ethBalance > 0) payable(owner).transfer(ethBalance);
        if (usdcBalance > 0) usdc.transfer(owner, usdcBalance);
        if (usdtBalance > 0) usdt.transfer(owner, usdtBalance);

        emit Withdraw(owner, ethBalance + usdcBalance + usdtBalance);
    }

    function getETHAmountForUSD(uint256 usdAmount) public view returns (uint256) {
        (, int256 price,,,) = ethUsdPriceFeed.latestRoundData(); // price in USD * 1e8
        require(price > 0, "Invalid price");
        uint256 ethAmount = (usdAmount * 1e8) / uint256(price); // normalize
        return ethAmount;
    }

    function getAllTags() external view returns (string[] memory) {
        return tags;
    }

    // Staff functions
    function addAttendee(address _attendee) external onlyStaff {
        require(!isAttendee[_attendee], "Attendee already added");
        require(attendeeCount < maxAttendees, "Event is full");
        
        attendeeCount += 1;
        isAttendee[_attendee] = true;
    }

    function removeAttendee(address _attendee) external onlyStaff {
        require(isAttendee[_attendee], "Not attending");
        require(attendeeCount > 0, "No attendees");
        
        attendeeCount -= 1;
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
}
