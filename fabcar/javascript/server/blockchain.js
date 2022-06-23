const { Gateway, Wallets } = require('fabric-network');

const path = require('path');
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const fs = require('fs');

async function contract()
{
    const ccpPath = path.resolve(__dirname,'..' ,'..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new file system based wallet for managing identities.
    const walletPath = path.resolve(__dirname, '..', 'wallet');
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

    return contract;
}

module.exports={contract}