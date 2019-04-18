'use strict';

const animalType = Object.freeze({
    SHEEP: '1',
    CATTLE: '2',
    PIG: '3',
    DEER_OTHER: '4'
});

const animalStatus = Object.freeze({
    IN_FIELD: '1',
    IN_TRANSIT: '2'
});

const productionType = Object.freeze({
    MEET: '1',
    WOOL: '2',
    DAIRY: '3',
    BREEDING: '4',
    OTHER: '5'
});

//
// module.exports = {
//     animalStatus,
//     animalType,
//     productionType
// };

// export {animalStatus}

const validUsers = ['farmer1', 'farmer2', 'farmer3', 'regulator'];

export  {
  animalStatus,
  animalType,
  productionType,
  validUsers
}
