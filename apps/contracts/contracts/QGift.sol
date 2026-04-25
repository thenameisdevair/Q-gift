// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract QGift {
    address public constant CUSD = 0x765DE816845861e75A25fCA122bb6898B8B1282a;

    event GiftSent(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string occasion,
        string message
    );

    function sendGift(
        address recipient,
        uint256 amount,
        string calldata occasion,
        string calldata message
    ) external {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than zero");
        require(recipient != msg.sender, "Cannot gift yourself");

        bool success = IERC20(CUSD).transferFrom(msg.sender, recipient, amount);
        require(success, "cUSD transfer failed");

        emit GiftSent(msg.sender, recipient, amount, occasion, message);
    }
}
