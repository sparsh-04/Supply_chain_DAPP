// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0.;

import "./ProductManager.sol";
contract ProductPaymentHandler
{
 uint public price;
    uint public index;
    uint public Quantity;
 bool public purchased;
    ProductManager public parentContract;
    
    constructor(ProductManager _parentContract, uint _idex, uint _price,uint _Quantity) public {
        parentContract = _parentContract;
        index = _idex;
       price = _price*_Quantity;
      Quantity = _Quantity;
    }
    receive() external payable {
        require(!purchased, "Product is already paid.");
   require(msg.value == price, "You must pay the exact amout that product costs.");

     (bool success, ) = address(parentContract).call{value: msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", index));
   require(success, "Transaction wan't successful.");
        purchased =
         true;
    }
}