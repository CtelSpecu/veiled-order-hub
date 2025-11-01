// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title VeiledOrder - Private order storage using FHEVM
/// @notice Stores encrypted trading orders (buy/sell) with amount and price
/// @dev This contract enables privacy-preserving order submission and retrieval
contract VeiledOrder is SepoliaConfig {
    struct Order {
        euint32 amount; // Encrypted amount in ETH (scaled by 1000 to support decimals)
        euint32 price;  // Encrypted price in USD (scaled by 1000 to support decimals)
        bool isBuy;     // Order type: true for buy, false for sell
        uint256 timestamp; // Block timestamp when order was created
    }

    // Mapping from user address to array of order indices
    mapping(address => uint256[]) private _userOrders;
    
    // Array of all orders
    Order[] private _orders;
    
    // Mapping from order index to user address
    mapping(uint256 => address) private _orderOwner;

    /// @notice Event emitted when a new order is submitted
    /// @param user Address of the user who submitted the order
    /// @param orderIndex Index of the order in the orders array
    /// @param isBuy True if buy order, false if sell order
    event OrderSubmitted(address indexed user, uint256 indexed orderIndex, bool isBuy);

    /// @notice Submit a new encrypted order
    /// @param amount External encrypted euint32 (amount in ETH, scaled by 1000)
    /// @param price External encrypted euint32 (price in USD, scaled by 1000)
    /// @param isBuy True for buy order, false for sell order
    /// @param inputProof The encryption input proof for both external handles
    function submitOrder(
        externalEuint32 amount,
        externalEuint32 price,
        bool isBuy,
        bytes calldata inputProof
    ) external {
        euint32 encAmount = FHE.fromExternal(amount, inputProof);
        euint32 encPrice = FHE.fromExternal(price, inputProof);

        uint256 orderIndex = _orders.length;
        
        _orders.push(Order({
            amount: encAmount,
            price: encPrice,
            isBuy: isBuy,
            timestamp: block.timestamp
        }));

        _userOrders[msg.sender].push(orderIndex);
        _orderOwner[orderIndex] = msg.sender;

        // Allow contract re-encryption and the caller to decrypt
        FHE.allowThis(encAmount);
        FHE.allowThis(encPrice);
        FHE.allow(encAmount, msg.sender);
        FHE.allow(encPrice, msg.sender);

        emit OrderSubmitted(msg.sender, orderIndex, isBuy);
    }

    /// @notice Get the caller's order indices
    /// @return Array of order indices belonging to the caller
    function getMyOrderIndices() external view returns (uint256[] memory) {
        return _userOrders[msg.sender];
    }

    /// @notice Get order details by index
    /// @param orderIndex Index of the order
    /// @return amount Encrypted amount handle
    /// @return price Encrypted price handle
    /// @return isBuy Order type
    /// @return timestamp Block timestamp when order was created
    /// @return owner Address of the order owner
    function getOrder(uint256 orderIndex) external view returns (
        euint32 amount,
        euint32 price,
        bool isBuy,
        uint256 timestamp,
        address owner
    ) {
        require(orderIndex < _orders.length, "Order does not exist");
        Order storage order = _orders[orderIndex];
        return (order.amount, order.price, order.isBuy, order.timestamp, _orderOwner[orderIndex]);
    }

    /// @notice Get the total number of orders
    /// @return Total count of orders
    function getOrderCount() external view returns (uint256) {
        return _orders.length;
    }

    /// @notice Get order count for a specific user
    /// @param user Address of the user
    /// @return Number of orders submitted by the user
    function getUserOrderCount(address user) external view returns (uint256) {
        return _userOrders[user].length;
    }
}

