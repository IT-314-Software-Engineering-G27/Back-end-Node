const { faker } = require("@faker-js/faker");

function generatePost() {
    return {
        title: faker.lorem.words({ min: 5, max: 10}),
        subject: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 10, max: 20})).join(' '),
        description: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 100, max: 400 })).join(' '),
        image: faker.image.url(),
    }
};

module.exports = {
    generatePost,
};