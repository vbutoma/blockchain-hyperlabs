'use strict';


const path = require('path');
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');

function getCert() {
    const ccpPath = path.resolve(__dirname, '..', 'network', 'basic-network', 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    return ccp;
}


function getWallet() {
    // Create a new file system based wallet for managing identities.
    const walletPath = "/home/vitaly/MINE/blockchain-hyperlabs/wallet";
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    return wallet;
}

//todo: remove hardcode
const { animalType, productionType, animalStatus } = require('../network/chaincode/carfab/lib/enums');
module.exports = {
    getCert,
    getWallet,
    animalType,
    productionType,
    animalStatus
};
