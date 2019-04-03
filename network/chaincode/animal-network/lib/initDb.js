'use strict';

const { animalType, productionType, animalStatus } = require('./enums');

const users = [
    {
        id: 1,
        email: "a@gmail.com",
        name: "a"
    },
    {
        id: 2,
        email: "b@gmail.com",
        name: "b"
    },
    {
        id: 1,
        email: "c@gmail.com",
        name: "c"
    }
];


const animals = [
    {
        id: 1,
        type: animalType.SHEEP,
        pType: productionType.WOOL,
        status: animalStatus.IN_TRANSIT,
        ownerId: 1
    },
    {
        id: 2,
        type: animalType.SHEEP,
        pType: productionType.WOOL,
        status: animalStatus.IN_FIELD,
        fieldId: 1,
        ownerId: 1
    },
    {
        id: 3,
        type: animalType.PIG,
        pType: productionType.MEET,
        status: animalStatus.IN_TRANSIT,
        ownerId: 2
    }
];

const fields = [
    {
        id: 1,
        name: "Grass1",
        desc: "The field with green-green grass"
    },
    {
        id: 2,
        name: "Grass2",
        desc: "The field with green-green grass and flowers"
    },
    {
        id: 2,
        name: "Grass3",
        desc: "The grass field near the lake"
    }
];


module.exports = {
    users,
    animals,
    fields,
};
