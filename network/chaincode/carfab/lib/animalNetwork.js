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
        const farmers = defaultDB.farmers;
        const regulators = defaultDB.regulators;
        const businesses = defaultDB.businesses;
        const animals = defaultDB.animals;
        const fields = defaultDB.fields;
        // order farmer=> reg => bus => fields => animals
        for (let i = 0; i < farmers.length; i++) {
            await this.createFarmer(ctx, farmers[i]);
            console.info('Added <--> ', farmers[i]);
        }
        for (let i = 0; i < regulators.length; i++) {
            await this.createRegulator(ctx, regulators[i]);
            console.info('Added <--> ', regulators[i]);
        }
        for (let i = 0; i < businesses.length; i++) {
            await this.createBusinness(ctx, businesses[i]);
            console.info('Added <--> ', businesses[i]);
        }
        for (let i = 0; i < animals.length; i++) {
            await this.createAnimal(ctx, animals[i]);
            console.info('Added <--> ', animals[i]);
        }
        for (let i = 0; i < fields.length; i++) {
            await this.createField(ctx, fields[i]);
            console.info('Added <--> ', fields[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryObject(ctx, type, id) {
        const number = `${type}_${id}`;
        const bytes = await ctx.stub.getState(number); // get the car from chaincode state
        if (!bytes || bytes.length === 0){
            throw new Error(`${bytes} does not exist`);
        }
        console.log(bytes.toString());
        return bytes.toString();
    }

    async queryAnimal(ctx, id) {
        return this.queryObject(ctx, 'animal', id);
    }

    async queryField(ctx, id) {
        return this.queryObject(ctx, 'field', id);
    }

    async queryUser(ctx, id) {
        return this.queryObject(ctx, 'user', id);
    }


    /**
     * Abstract object creation
     * @param ctx
     * @param type: string
     * @param params: {}
     * @returns {Promise<any>}
     */
    createObjectByParams(ctx, type, params) {
        return new Promise((resolve, reject) => {
            if (typeof(params) === 'string') params = JSON.parse(params);
            console.info(JSON.stringify(params));
            const number = `${type}_${params['id']}`;
            ctx.stub.putState(number, Buffer.from(JSON.stringify(params)))
                .then((id) => {
                    console.info('New object created', id, params);
                    return resolve()
                })
                .catch((err) => {
                    console.info('Error creating object', err);
                    reject(err);
                })
        });
    }


    async createFarmer(ctx, farmer) {
        return this.createObjectByParams(ctx, 'farmer', farmer);
    }

    async createRegulator(ctx, regulator) {
        return this.createObjectByParams(ctx, 'regulator', regulator);
    }

    async createAnimal(ctx, animal) {
        return this.createObjectByParams(ctx, 'animal', animal);
    }

    async createField(ctx, field) {
        return this.createObjectByParams(ctx, 'field', field);
    }


    async createBusinness(ctx, business) {
        return this.createObjectByParams(ctx, 'business', business);
    }

    async createMovement(ctx, movement) {
        return this.createObjectByParams(ctx, 'movement', movement);
    }

    async queryAll(ctx) {

        const querable = ['user', 'animal', 'field'];
        const allResults = [];
        for (let q of querable) {
            const startKey = `${q}_0`;
            const endKey = `${q}_999`; // todo: add max size conf
            const iterator = await ctx.stub.getStateByRange(startKey, endKey);
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
                }
            }
            await iterator.close();
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async getUserData(ctx, type) {
        // todo:
        return {};
    }

    async getUserAnimals(ctx, userId) {
        let results = [];
        const startKey = `animal_0`;
        const endKey = `animal_999`; // todo: add max size conf
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
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
                results.push({ Key, Record });
            }
            if (res.done) break;
        }
        await iterator.close();
        console.log(results);
        console.log('Filtering by ', userId);
        results = results.filter((item) => item.Record.ownerId === userId);
        return JSON.stringify(results);
    }

    async getUserFields(ctx, userId) {
        let results = [];
        const startKey = `field_0`;
        const endKey = `field_999`; // todo: add max size conf
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
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
                results.push({ Key, Record });
            }
            if (res.done) break;
        }
        await iterator.close();
        console.log('Filtering by ', userId);
        results = results.filter((item) => item.Record.ownerId === userId);
        return JSON.stringify(results);
    }

    async getUserMovements(ctx, userId) {
        let results = [];
        const startKey = `movement_0`;
        const endKey = `movement_999`; // todo: add max size conf
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
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
                results.push({ Key, Record });
            }
            if (res.done) break;
        }
        await iterator.close();
        console.log()
        results = results.filter((item) => (item.Record.firstFarmerId === userId ||
            item.Record.secondFarmerId === userId || item.Record.regulatorId === userId));
        return JSON.stringify(results);
    }


}

module.exports = AnimalNetwork;
