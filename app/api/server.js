'use strict';

const Hapi = require('hapi');
const { submitTransaction, fetchData } = require('./queryRunner');
let mCnt = 0; // супер костылина

const init = async () => {

    const server = Hapi.server({
        port: 8081,
        host: 'localhost',
        "routes": {
            "cors": {
                origin: ["*"],
                credentials: true,
                additionalHeaders: ["cache-control", "x-requested-with", 'Access-Control-Allow-Origin'],
            }

        },
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    server.route({
        method: 'GET',
        path: '/user',
        handler: (req, h) => {
            return new Promise((resolve, reject) => {
                const userId = req.query.id;
                console.log(userId)
                const transactions = ['getUserAnimals', 'getUserFields', 'getUserMovements'];
                const tasks = transactions.map((x) => fetchData(userId, x, [userId]));
                return Promise.all(tasks)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });



        }
    });

    server.route({
        method: 'POST',
        path: '/createMovement',
        handler: (req, h) => {
            return new Promise((resolve, reject) => {
                const p = req.payload || {};
                const userId = p.firstFarmerId;
                const body = {
                    'id': mCnt,
                    'firstFarmerId': p.firstFarmerId,
                    'secondFarmerId': p.secondFarmerId,
                    'animalId': p.animalId,
                    'regulatorId': p.regulatorId,
                    'status': p.status,
                    'info': p.info
                };
                console.log(JSON.stringify(body));
                const transactions = ['createMovement'];
                const tasks = transactions.map((x) => submitTransaction(userId, x, [JSON.stringify(body)]));
                return Promise.all(tasks)
                    .then((res) => {
                        mCnt += 1;
                        resolve(`movement_${mCnt-1}`);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/approve',
        handler: (req, h) => {
            return new Promise((resolve, reject) => {
                const p = req.payload || {};
                const userId = p.firstFarmerId;
                const id = +p.mId.split('_')[1];
                const body = {
                    'id': id,
                    'firstFarmerId': p.firstFarmerId,
                    'secondFarmerId': p.secondFarmerId,
                    'animalId': p.animalId,
                    'regulatorId': p.regulatorId,
                    'status': p.status, // todo
                    'info': p.info
                };
                console.log(JSON.stringify(body));
                const transactions = ['createMovement'];
                const tasks = transactions.map((x) => submitTransaction(userId, x, [JSON.stringify(body)]));
                return Promise.all(tasks)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        }
    });


    server.route({
       method: 'POST',
       path: '/update_animal_field',
        handler: (req, h) => {
           return new Promise((resolve, reject) => {
               const p = req.payload || {};
               const userId = p.firstFarmerId;
               const body = p;
               console.log(JSON.stringify(body));
               const transactions = ['createAnimal'];
               const tasks = transactions.map((x) => submitTransaction(userId, x, [JSON.stringify(body)]));
               return Promise.all(tasks)
                   .then((res) => {
                       resolve(res);
                   })
                   .catch((err) => {
                       console.log(err);
                       reject(err);
                   });
           })
        }
    });

    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
