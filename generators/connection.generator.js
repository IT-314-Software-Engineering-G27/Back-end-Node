const { faker } = require('@faker-js/faker');

function generateConnection({ userId1, userId2 }) {
    return {
        from: userId1,
        to: userId2,
    }
};

function generateMessage() {
    return {
        content: faker.lorem.sentence(),
    }
}

module.exports = {
    generateConnection,
    generateMessage,
};