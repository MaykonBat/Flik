// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Mock Chainlink Price Feed
/// @notice Simulates Chainlink's AggregatorV3Interface for testing
contract MockV3Aggregator {
    int256 private _price;
    uint8 private immutable _decimals;

    constructor(uint8 decimals_, int256 initialPrice) {
        _decimals = decimals_;
        _price = initialPrice;
    }

    /// @notice Returns the number of decimals used in the price feed
    function decimals() external view returns (uint8) {
        return _decimals;
    }

    /// @notice Returns a dummy description
    function description() external pure returns (string memory) {
        return "Mock ETH/USD Price Feed";
    }

    /// @notice Returns the latest round data, same format as Chainlink
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, _price, block.timestamp, block.timestamp, 0);
    }

    /// @notice Manually set the mock price
    /// @param newPrice The new ETH/USD price (e.g., 2000 * 1e8)
    function updateAnswer(int256 newPrice) external {
        _price = newPrice;
    }

    /// @notice Read the current stored price
    function getLatestPrice() external view returns (int256) {
        return _price;
    }
}
