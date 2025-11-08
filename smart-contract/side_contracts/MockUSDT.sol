// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Mock Tether USD", "USDT") {}

    /// @notice Mint new tokens for testing
    /// @param to The address to receive the tokens
    /// @param amount The amount to mint (6 decimals)
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /// @notice Override to simulate 6 decimals like real USDT
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
