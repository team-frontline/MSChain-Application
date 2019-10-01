/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var fs = require('fs');


const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = '/home/supimi/hyperledger/fabric-samples/first-network/connection-org1.json';

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        console.log("from query.js.................");
        const walletPath = path.join(process.cwd(), 'hfc-key-store');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        console.log("dwhcbdehbchjedbchjwdbc");
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('ctb');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var certPath = "/home/supimi/FYP/test-materials/CTB-master/CA-Blockchain/CA-Application/certificates/CA1/ashoka/ashoka.pem"; //proposed certificate
        var certString = fs.readFileSync(certPath).toString();

        console.log(">>>>>>>>>>drftbgvhnjmk");
        const result = await contract.evaluateTransaction('queryCertificate',"ashoka.edu.in");
        console.log(result);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
