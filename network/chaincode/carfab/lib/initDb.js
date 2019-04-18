'use strict';

const { animalType, productionType, animalStatus } = require('./enums');

const farmers = [
    {
        id: 'farmer1',
        email: "farmer1@gmail.com",
        name: "farmer1"
    },
    {
        id: 'farmer2',
        email: "farmer2@gmail.com",
        name: "farmer2"
    },
    {
        id: 'farmer3',
        email: "farmer3@gmail.com",
        name: "farmer3"
    }
];

const regulators = [
    {
        id: 'regulator',
        name: "regulator"
    }
];

const businesses = [
    {
        id: 1,
        info: "b1",
        ownerId: 'farmer1'
    },
    {
        id: 2,
        info: "b2",
        ownerId: 'farmer2'
    },
    {
        id: 3,
        info: "b3",
        ownerId: 'farmer3'
    }
];


const animals = [
    {
        id: 1,
        type: animalType.SHEEP,
        pType: productionType.WOOL,
        status: animalStatus.IN_TRANSIT,
        ownerId: 'farmer1'
    },
    {
        id: 2,
        type: animalType.SHEEP,
        pType: productionType.WOOL,
        status: animalStatus.IN_FIELD,
        fieldId: 1,
        ownerId: 'farmer1'
    },
    {
        id: 3,
        type: animalType.PIG,
        pType: productionType.MEET,
        status: animalStatus.IN_TRANSIT,
        ownerId: 'farmer2'
    }
];

const fields = [
    {
        id: 1,
        name: "Grass1",
        description: "The field with green-green grass",
        businessId: 1,
        ownerId: 'farmer1'
    },
    {
        id: 2,
        name: "Grass2",
        description: "The field with green-green grass and flowers",
        businessId: 2,
        ownerId: 'farmer1'
    },
    {
        id: 3,
        name: "Grass3",
        description: "The grass field near the lake",
        businessId: 3,
        ownerId: 'farmer2'
    }
];


module.exports = {
    farmers,
    regulators,
    businesses,
    fields,
    animals
};
