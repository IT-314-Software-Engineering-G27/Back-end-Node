const { faker } = require("@faker-js/faker");

function generateJobProfile() {
    return {
        title: faker.person.jobTitle(),
        description: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 18, max: 40 })).join(' '),
        posting_location: `${faker.location.secondaryAddress()} ${faker.location.city()} ${faker.location.country()}`,
        requirements: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 18, max: 20 })).join(' '),
        compensations: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 5, max: 12 })).join(' '),
        salary: faker.number.int({ min: 1000, max: 30000 }),
        duration: faker.helpers.randomize(['full-time', 'part-time', 'internship', 'contract']),
    }
};

module.exports = {
    generateJobProfile,
};