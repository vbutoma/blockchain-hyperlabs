/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const { Contract } = require('fabric-contract-api');

const { animalType, productionType, animalStatus } = require('./enums');
const defaultDB = require('./initDb');
const initializable = ['users', 'animals', 'fields'];


class AnimalNetwork extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        // Participants: Farmer, Regulator
        // Assets: Animal, Business, Field
        // Transactions: createAnimal, moveAnimal, updateAnimal
        console.info("TEMP MESSAGE");
        for (const [k, v] of Object.entries(defaultDB)) {
            if (initializable.includes(k)) {
                console.info(k, v);
                const className = k.endsWith('s') ? k.slice(0, -1) : k;
                console.log('Classname', className);
                // k - Class (animal, user, field),
                for (let i = 0; i < v.length; i++) {
                    await ctx.stub.putState(`${className}_${i}`, Buffer.from(JSON.stringify(v[i])));
                    console.info('Added <--> ', v[i]);
                }
            }
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryObject(ctx, id) {
        const bytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!bytes || bytes.length === 0) {
            throw new Error(`${bytes} does not exist`);
        }
        console.log(bytes.toString());
        return bytes.toString();
    }

    async queryAnimal(ctx, id) {
        return this.queryObject(ctx, id);
    }

    async queryField(ctx, id) {
        return this.queryObject(ctx, id);
    }

    async queryUser(ctx, id) {
        return this.queryObject(ctx, id);
    }

    async createObject(ctx, type, args) {
        let creationPromise = () => Promise.reject('Unknown object type');
        switch (type) {
            case "user": creationPromise = this.createUser; break;
            case "animal": creationPromise = this.createAnimal; break;
            case "field": creationPromise = this.createField; break;
            default:
                break;
        }
        try {
            const id = await creationPromise(ctx, ...args);
        }
        catch (e) {
            console.log(`Can't create object of type: ${type} with ${args}. Reason: ${e}`);
            return;
        }
        return id;
    }


    async createUser(ctx, name, email) {
        console.info('============= START : Create User ===========');
        console.info('============= END : Create User ===========');
    }

    async createAnimal(ctx, type, pType, ownerId, status, fieldId) {
        console.info('============= START : Create Animal ===========');
        console.info('============= END : Create Animal ===========');
    }

    async createField(ctx, name, description) {
        console.info('============= START : Create Field ===========');
        const field = {
            name,
            description,
        };
        // todo: gen Id
        const id = await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Field ===========');
        return id;
    }


    async queryAll(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const querable = ['user', 'animal', 'field'];
        const allResults = [];
        for (let q of querable) {
            const startKey = `${q}_0`;
            const endKey = `${q}_999`;
            const iterator = await ctx.stub.getStateByRange(startKey, endKey);
            // const iterator = await ctx.stub.getStateByPartialCompositeKey(q, []);
            while (true) {
                const res = await iterator.next();
                if (res.value && res.value.value.toString()) {
                    console.log(res.value.value.toString('utf8'));

                    const Key = res.value.key;
                    let Record;
                    try {
                        Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        Record = res.value.value.toString('utf8');
                    }
                    allResults.push({ Key, Record });
                }
                if (res.done) {
                    console.log('end of data');
                    break;
                    await iterator.close();
                }
            }
            await iterator.close();
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = AnimalNetwork;
