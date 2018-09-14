pragma solidity ^0.4.19;

contract EventEmitter {

    address public owner;

    constructor () public {
        owner = msg.sender;
    }

    event EmittedTag(bytes32 tag);

    function emitBytes32(bytes32 tag) public returns (bytes32){
        emit EmittedTag(tag);
        return tag;
    }
}

