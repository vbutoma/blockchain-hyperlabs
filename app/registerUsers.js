'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');

const utils = require('./utils');
const ccp = utils.getCert();

const registerUser = async (userName) => {
    try {

        const wallet = utils.getWallet(ccp);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (userExists) {
            console.log(`An identity for the user ${userName} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();
        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: userName, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: userName, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import(userName, userIdentity);
        console.log(`Successfully registered and enrolled admin user ${userName} and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user ${userName}: ${error}`);
    }
};


const userNames = ['farmer1', 'farmer2', 'farmer3', 'regulator1', 'regulator'];
const registrationTasks = userNames.map(name => registerUser(name));

Promise.all(registrationTasks)
    .then(() => {
        console.log(`${userNames} successfully registered`);
    })
    .catch((err) => {
       console.error(`Error during users registration: ${err}`);
    });


