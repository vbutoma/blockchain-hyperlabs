'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');

const utils = require('../utils');
const { animalType, productionType, animalStatus } = require('../utils');
const ccp = utils.getCert();

const getContract = async (userName) => {
    // Create a new file system based wallet for managing identities.
    const wallet = utils.getWallet(ccp);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userName);
    if (!userExists) {
        console.log(`An identity for the user ${userName} does not exist in the wallet`);
        console.log('Run the registerUsers.js application before retrying');
        return ;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: { enabled: false } });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    // Get the contract from the network.
    return network.getContract('carfab');
};

const submitTransaction = async (userName, transaction, params) => {
    const contract = await getContract(userName);
    const result = await contract.submitTransaction(transaction, ...params);
    console.log(`Transaction has been submitted, result is: ${result.toString()}`);
    return {};
};

const fetchData = async (userName, transaction, params) => {
    const contract = await getContract(userName);
    const result = await contract.evaluateTransaction(transaction, ...params);
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    return JSON.parse(JSON.parse(result.toString()))
};



module.exports = {
    submitTransaction,
    fetchData
};
