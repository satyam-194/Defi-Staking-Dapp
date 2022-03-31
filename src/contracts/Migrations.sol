pragma solidity ^0.5.0;

contract Migrations {

address public owner;
uint public last_completed_migration;

 constructor() public  {
    owner=msg.sender;
}

modifier restricted(){
    if(owner==msg.sender) _;
    
}

function setCompleted(uint completed) public restricted{
    last_completed_migration = completed;
}

function ugrade(address new_address) public restricted {
    Migrations upgrade= Migrations(new_address);
    upgrade.setCompleted(last_completed_migration);

}


}