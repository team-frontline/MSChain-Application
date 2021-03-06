'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = '/home/supimi/hyperledger/fabric-samples/first-network/connection-org2.json';
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
        const caTLSCACertsPath = '/home/supimi/hyperledger/fabric-samples/first-network/'+caInfo.tlsCACerts.path;
        const caTLSCACerts = fs.readFileSync(caTLSCACertsPath);
       // console.log(">>>>>>>>>>>>>>>>>>",caInfo.url,caTLSCACerts,caInfo.caName);
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'hfc-key-store');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin2');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }
       
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Org2MSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('admin2', identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the hfc-key-store');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();
