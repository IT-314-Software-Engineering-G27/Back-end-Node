const { faker } = require("@faker-js/faker");

function generatePost() {
    return {
        title: faker.lorem.words(),
        subject: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 10, max: 20})).join(' '),
        description: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 30, max: 40 })).join(' '),
    }
};

module.exports = {
    generatePost,
};