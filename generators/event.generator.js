const { faker } = require("@faker-js/faker");

function generateEvent() {
    const start_time = faker.date.anytime();
    const end_time = faker.date.between({ from: start_time, to: new Date(start_time.getTime() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 30)) });
    return {
        title: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 5, max: 8 })).join(' '),
        description: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 20, max: 30 })).join(' '),
        start_time,
        end_time,
        last_registration_date: faker.date.between({ from: start_time, to: end_time }),
    };
}

function generateRegistration() {
    const images = [];
    for (let i = 0; i < faker.number.int({ min: 0, max: 3 }); i++) {
        images.push(faker.image.url());
    }
    return {
        title: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 5, max: 8 })).join(' '),
        description: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 20, max: 30 })).join(' '),
        images,
    }
}

module.exports = {
    generateEvent,
    generateRegistration,
};