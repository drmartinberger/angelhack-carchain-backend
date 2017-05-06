import {
    Ed25519Keypair,
    makeEd25519Condition,
    makeOutput,
    makeCreateTransaction,
    makeTransferTransaction,
    signTransaction,
} from './bigchaindb'; // Or however you'd like to import it

import faker from './faker';
const express = require('express');
import rp from 'request-promise';
const bodyParser = require('body-parser')

class Bigchaindb {
    constructor() {
        //this.keypair = new Ed25519Keypair();
        this.keypair = {
                        publicKey: 'DePKLLGt7qQ3J8kbTNow2psobziipEq8bqA4SnCm3V8K',
                        privateKey: 'AgBBQZsZvwDfV6Em9imheF4C6JdUYi7waViEznrhUXen'
        };
        // Let's get an output and condition that lets Ash be the recipient of the new asset we're creating
        this.condition = new makeEd25519Condition(this.keypair.publicKey);
        this.output = new makeOutput(this.condition);
    }

    createAsset(asset) {
        const noMetadata = null; // Let's ignore that meta-stuff for now

        const createPokeTx = makeCreateTransaction(asset, noMetadata, [this.output], this.keypair.publicKey);

        const signedCreateTx = signTransaction(createPokeTx, this.keypair.privateKey);
    
        return signedCreateTx;
    }

    transfer(publicKey, tx) {
        const condition = new makeEd25519Condition(publicKey);
        const output = new makeOutput(condition);
        const fulfilledOutputIndex = 0;
        const noMetadata = null;
        const transferTx = makeTransferTransaction(tx, noMetadata, [output], fulfilledOutputIndex);

        return signTransaction(transferTx, this.keypair.privateKey);
    }

    transaction(element) {
        return rp({
            url: 'http://localhost:9984/api/v1/transactions/',
            method: "POST",       
            json: element
        })
    }

}

let bigchain = new Bigchaindb();

setInterval(() => {
    console.log('creating asset...');

    let asset = bigchain.createAsset(faker.getAsset());
    bigchain.transaction(asset)
            .then(ret => {}, err => {})
}, 1000);

const app = express();
app.use(bodyParser.json());

app.post('/transfer', function (req, res) {
    let tx = req.body.tx;
    let publicKey = req.body.publicKey;

    let transfer = bigchain.transfer(publicKey, tx);
    bigchain
        .transaction(transfer)
        .then(result => res.send(result), err => res.send(err));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
