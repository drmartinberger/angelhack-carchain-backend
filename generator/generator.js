import {
    Ed25519Keypair,
    makeEd25519Condition,
    makeOutput,
    makeCreateTransaction,
    makeTransferTransaction,
    signTransaction,
} from './bigchaindb'; // Or however you'd like to import it
import faker from './faker';

import rp from 'request-promise';

class Bigchaindb {
    constructor() {
        this.keypair = new Ed25519Keypair();

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

    transfer() {
        const brock = new Ed25519Keypair(); // public: "H8ZVy61CCKh5VQV9nzzzggNW8e5CyTbSiegpdLqLSmqi", private: "5xoYuPP92pznaGZF9KLsyAdR5C7yDU79of1KA9UK4qKS"
        const brockCondition = new makeEd25519Condition(brock.publicKey);
        const brockOutput = new makeOutput(brockCondition);
        const fulfilledOutputIndex = 0;
        const transferPokeTx = makeTransferTransaction(createPokeTx, noMetadata, [brockOutput], fulfilledOutputIndex);

        // OK, let's sign this TRANSFER (Ash has to, as he's the one currently in "control" of Pikachu)
        const signedTransferTx = signTransaction(transferPokeTx, ash.privateKey);
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
    let asset = bigchain.createAsset(faker.getAsset());
    bigchain.transaction(asset)
            .then(ret => {}, err => {})
}, 1000);
