// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Meditran {

    uint public transactionCount = 0;
    bytes32[20] public hashArray;

    struct Transaction {
        uint id;
        uint batch_id;
        string transaction_hash;
        uint value;
        string expiry_date;
        uint256 timestamp;
    }

    mapping(uint => Transaction) public transactions;


    constructor() public {
        createTransaction(0,"0",0,"0");
    }

    function createTransaction(uint _batch_id, string memory _transaction_hash, uint  _value, string  memory _expirey_date) public {
        transactionCount ++;
        transactions[transactionCount] = Transaction(transactionCount,_batch_id,_transaction_hash,_value,_expirey_date,block.timestamp);
        // emit TaskCreated(taskCount, _content, false);
    }

    // function getTransaction() external view returns(uint[] memory, uint[] memory, bytes32[] memory, uint[] memory, uint256[] memory, uint256[] memory) {
    //     uint[] memory id = new uint[](transactionCount);
    //     uint[] memory batch_id = new uint[](transactionCount);
    //     bytes32[] memory transaction_hash = new bytes32[](transactionCount);
    //     uint[] memory value = new uint[](transactionCount);
    //     uint256[] memory expiry_date = new uint256[] (transactionCount);
    //     uint256[] memory timestamp = new uint256[] (transactionCount);

    //     for(uint i = 1;i<=transactionCount;i++){
    //         id[i] = transactions[i].id;
    //         batch_id[i] = transactions[i].batch_id;
    //         transaction_hash[i] = transactions[i].transaction_hash;
    //         value[i] = transactions[i].value;
    //         expiry_date[i] = transactions[i].expiry_date;
    //         timestamp[i] = transactions[i].timestamp;
    //     }

    //     return(id,batch_id,transaction_hash,value,expiry_date,timestamp);
    // }

    // function getTransaction(uint _batch_id) internal {
        
    //     uint256 k = 0;
    //     for(uint256 i = 0;i<=transactionCount;i++){
    //         if(_batch_id == transactions[i].batch_id){
    //             hashArray[k] = transactions[i].transaction_hash;
    //             k++;
    //         }
    //     }
    // }

    // function returnTransaction(uint _batch_id) public returns (bytes32[20] memory){
    //     getTransaction(_batch_id);
    //     return hashArray;

    // }
}
