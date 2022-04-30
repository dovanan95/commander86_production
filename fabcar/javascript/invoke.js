/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        //await contract.submitTransaction('createUser', 'ETB', 'Ethermath', '01423456789', 'MG', 'TGD', 'BCT', '6868');
        //await contract.submitTransaction('changeUserPhone', 'BTC', '0142345678912');
        //console.log('Transaction has been submitted');

        const message = [
			{
				messID: '001',
				sender: 'DVA',
                sender_name: 'Do Van An',
                docType: 'private_message',
				receiver: 'LTA',
				content: 'OK',
				timestamp: 1
			},
			{
				messID: '002',
				sender: 'LTA',
                sender_name: 'Le Thi Anh',
                docType: 'private_message',
				receiver: 'DVA',
				content: 'NG',
				timestamp: 2
			},
			{
				messID: '003',
				sender: 'TVT',
                sender_name: 'Tong Viet Trung',
                docType: 'private_message',
				receiver: 'LTA',
				content: 'hehe',
				timestamp: '3'
			},
			{
				messID: '004',
				sender: 'DVA',
                sender_name: 'Do Van An',
                docType: 'private_message',
				receiver: 'LTA',
				content: 'grzzz',
				timestamp: '4'
			},
			{
				messID: '005',
				sender: 'LTA',
                sender_name: 'Le Thi Anh',
                docType: 'private_message',
				receiver: 'DTC',
				content: 'vcl',
				timestamp: '5'
			},
            {
				messID: '006',
				sender: 'DTC',
                sender_name: 'Dinh The Cuong',
                docType: 'private_message',
				receiver: 'TVT',
				content: 'ahihi',
				timestamp: '6'
			},
            {
				messID: '007',
				sender: 'BTC',
                sender_name: 'Bitcoin',
                docType: 'private_message',
				receiver: 'DVA',
				content: 'con ga',
				timestamp: '7'
			},
		];
        /*
        for(let j in message)
        {
            await contract.submitTransaction('savePrivateMessage', message[j].messID ,message[j].sender,message[j].sender_name, 
                                                    message[j].receiver, message[j].content, parseInt(Date.now()));
        }*/
        //await contract.submitTransaction('savePrivateMessage','009', 'DVA','Do Van An','LTA', 'OK', Date.now().toString());
        //const response_cr_user = await contract.submitTransaction('createUser', 'ETH', 'Ethermathaaa', '01423453556789', 'MGG', 'TGGD', 'BCT', '6868');
        //console.log(response_cr_user.toString());
        // Disconnect from the gateway.
        //const authen = await contract.evaluateTransaction('authentication','LTA', '6863448'); console.log(authen.toString());
        //const qr_mess = await contract.evaluateTransaction('queryMessage','DVA', 'LTA', 'private_message'); console.log(qr_mess.toString());
        //const authen = await contract.evaluateTransaction('queryUser', 'DVA'); console.log(authen.toString());
        console.log(Date.now().toString())
        await contract.submitTransaction('verifyMessBlockchain','MessPriv.783.777.1649775692555', Date.now().toString());
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
