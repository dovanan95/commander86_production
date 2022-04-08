/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { query } = require('express');
const fabnet = require("fabric-network");
const { BlockDecoder } = require('fabric-common');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        //const result = await contract.evaluateTransaction('queryAllData');
        //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        const result_2 = await contract.evaluateTransaction('queryCustom','{"selector":{"docType":"user","userID":"BTC"}}');
        //console.log('custome query 1', result_2.toString());
        //const result_3 = await contract.evaluateTransaction('queryCustom','{"selector":{"password":"6868","userID":"LTA"}}');
        //console.log('custom query 2:', result_3.toString());
        //const result_4 = await contract.evaluateTransaction('queryCustom','{"selector":{"password":"6869","userID":"LTA"}}');
        //console.log('custom query 3:', JSON.parse(result_4.toString()).length);
        //const result_5 = await contract.evaluateTransaction('queryMessage', 'LTA', 'DVA', 'private_message');
        //console.log('query message 1:', result_5.toString());

        const query_private_message = {
            "selector":{
                "$or":[
                    {"sender": 'DVA', "receiver": 'LTA'},
                    {"sender": 'LTA', "receiver": 'DVA'}
                ],
                "timestamp": {"$gt": null}
            },
            "sort":[{"timestamp":"desc"}],
            "limit": 100,
            "skip":0,
            "use_index": ["_design/indexPrivMessDoc", "indexPrivMess"]
        }
        const result_6 = await contract.evaluateTransaction('queryCustom',JSON.stringify(query_private_message));//console.log('custom query 4:', result_6.toString());
        //
        //await contract.submitTransaction('updateCommandHistory', 'DVA', 'LTA', 'private_message');
        //await contract.submitTransaction('changeUserPhone', 'BTC','12345367');

        const messHistory = await contract.evaluateTransaction('queryHistoryMessage', 'LTA');
        //console.log(messHistory.toString());
        const authen = await contract.evaluateTransaction('queryUser', 'DVA'); //console.log(authen.toString());
        //get block content

        const { TextEncoder, TextDecoder } = require("util");
        const crypto = require('crypto');
        async function sha256(message) {
            var hash = crypto.createHash('sha256').update(message).digest('hex');
            return hash;
        }
        var asn = require('asn1.js');
        var calculateBlockHash = async function(header) {
            let headerAsn = asn.define('headerAsn', function() {
                this.seq().obj(
                this.key('Number').int(),
                this.key('PreviousHash').octstr(),
                this.key('DataHash').octstr()
                );
            });
        
            let output = headerAsn.encode({
                    Number: parseInt(header.number),
                    PreviousHash: Buffer.from(header.previous_hash, 'hex'),
                    DataHash: Buffer.from(header.data_hash, 'hex')
                }, 'der');
                let hash = await sha256(output);
                return hash;
        };
        
        async function getblock(block_number, channel_name){
            const contract_1 = network.getContract('qscc');
            const resultByte = await contract_1.evaluateTransaction(
                'GetBlockByNumber',
                channel_name,
                String(block_number)
            );
            const resultJson = BlockDecoder.decode(resultByte);
            return resultJson;
        }

        var block = await getblock(22, 'mychannel'); console.log('block',block);
        var header = block['header']; console.log('header', header);
        var calculatedBlockHash = await calculateBlockHash(header); console.log('hashed: ', calculatedBlockHash);

        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
