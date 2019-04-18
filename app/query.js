 /*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const { FileSystemWallet, Gateway } = require('fabric-network');

const utils = require('./utils');
const { animalType, productionType, animalStatus } = require('./utils');
const ccp = utils.getCert();

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const wallet = utils.getWallet(ccp);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('farmer1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'farmer1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('carfab');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')

        const result = await contract.evaluateTransaction('queryAll');
        // const result = await contract.evaluateTransaction('queryAll');
        // const result = await contract.evaluateTransaction('queryAnimal', '7');
        // const result = await contract.evaluateTransaction('queryObject', 'field', '1');
        //
        // let params = ['7', animalType.PIG, productionType.OTHER, '2', animalStatus.IN_TRANSIT];
        // const result = await contract.submitTransaction('createAnimal', ...params);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        process.exit(0);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
