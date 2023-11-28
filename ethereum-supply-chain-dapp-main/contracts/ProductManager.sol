// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0.;
import "./ProductPaymentHandler.sol";
import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract ProductManager is Ownable{
    
    enum ProductState{Created, Paid, Delivered}
    struct Product{
        string uid;
        uint Quantity;
        uint price;
        ProductState state;
        ProductPaymentHandler paymentHandler;

    }
    mapping(uint => Product) public products;
    uint public index;
    event ProductStateChanged(uint _productIndex, uint _step, address productPaymentAddress);
    function createProduct(string memory _id, uint _price,uint _Quantity) public onlyOwner {
        ProductPaymentHandler paymentHandler = new ProductPaymentHandler(this, index, _price*1000000000,_Quantity);
        products[index].paymentHandler = paymentHandler;
        products[index].uid = _id;
        products[index].price = _price*1000000000*_Quantity;
        products[index].Quantity = _Quantity;
        products[index].state = ProductState.Created;
        
        emit ProductStateChanged(index, uint(products[index].state), address(products[index].paymentHandler));
        index++;
    }
    function triggerPayment(uint _productIndex) public payable{
     require(products[_productIndex].price <= msg.value, "Cannot purchase due to less balance.");
   require(products[_productIndex].state == ProductState.Created, "Can't purchase the product, product is already sold");
        
     products[_productIndex].state = ProductState.Paid;
   emit ProductStateChanged(_productIndex, uint(products[_productIndex].state), address(products[_productIndex].paymentHandler));
    }
    
    /**
     *  Shipping the product.
     */
    function triggerDelivery(uint _productIndex) public onlyOwner {
 require(products[_productIndex].state == ProductState.Paid, "cannot be sent for delivery");
    
 products[_productIndex].state = ProductState.Delivered;
        emit ProductStateChanged(_productIndex, uint(products[_productIndex].state), address(products[_productIndex].paymentHandler));
    }
    
    
    function withdraw() public onlyOwner{
        msg.sender.transfer(address(this).balance);
    }
function renounceOwnership() public override onlyOwner {
        revert("You're not able to renounce ownership");
    }
}