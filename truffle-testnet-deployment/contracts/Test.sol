pragma solidity ^0.4.19;

contract Test {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
   
}