
const SHA256 = require('crypto-js/sha256');
const Block = require('./Block');


//Actual blockchain class - will be exposed as SERVICE to the controller class for encapsulating the functionality
class Blockchain {
    constructor(db){
        console.log('inside constructor ..... ');
        this.chain = db;
        this.chain.isEmpty().then(result => {
            if(result) {
                console.log("Blockchain DB is empty. Creating new Blockchain with 1 genesis block...");
                this.addBlock(new Block("First block in the chain - Genesis block"));
            } else {
                console.log("Blockchain DB has blocks. Reading Blockchain from DB...");
            }
        }).catch(err => {
            throw err;
        });
    }

    getChain() {
        return this.chain;
    }

    addBlock(newBlock){
        let _this = this;
        return new Promise((resolve, reject) => {
            newBlock.time = new Date().getTime().toString().slice(0,-3);
            _this.chain.getChainLength().then(chainLength => {
                newBlock.height = chainLength;
                if(chainLength === 0) {
                    return new Promise((resolve, reject) => {
                        console.log("chain length = 0, return null instead of block");
                        resolve(null);
                    });
                } else {
                    console.log(`chain length is ${chainLength}, return previous block`);
                    return _this.chain.getBlock(chainLength - 1);
                }
            }).then(previousBlock => {
                if(previousBlock === null) {
                    newBlock.previousBlockHash = "";
                } else {
                    newBlock.previousBlockHash = previousBlock.hash;
                }
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                return _this.chain.saveBlock(newBlock);
            }).then(saveOperationResult => {
                console.log("block saved");
                resolve(saveOperationResult);
            }).catch(err => {
                reject(new Error(`${err.message}`));
            });
        });
    }

    getBlockHeight() {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.chain.getChainLength().then(currentLength => {
                resolve(currentLength);
            }).catch(err => {
                reject(new Error(`${err.message}`));
            });
        });
    }

    getBlock(blockHeight){
        return new Promise((resolve, reject) => {
            this.chain.getBlock(blockHeight).then(block => {
                resolve(block);
            }).catch(err => {
                reject(new Error(`${err.message}`));
            });
        });
    }

    validateBlock(blockHeight){
        let _this = this;
        return new Promise(function(resolve, reject){
            _this.chain.getBlock(blockHeight).then(block => {
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    resolve(true);
                } else {
                    reject(new Error('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash));
                }
            });
        });
    }

    validateChain() {
        let errors = [];
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.chain.getChainLength()
                .then(currentLength => {
                    let allBlockValidations = [];
                    for(let i = 0; i < currentLength; i++) {
                        allBlockValidations.push(
                            _this.validateBlock(i)
                                .catch(err => {
                                    errors.push(err);
                                })
                        );
                    }
                    return Promise.all(allBlockValidations);
                })
                .then(value => {
                    if(errors.length > 0) {
                        reject(errors);
                    } else {
                        resolve(true);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
module.exports = Blockchain;
