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
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    return wallet;
}



module.exports = {
    getCert,
    getWallet
};