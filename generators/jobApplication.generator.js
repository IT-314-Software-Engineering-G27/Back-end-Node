const { faker } = require("@faker-js/faker");

function generateJobApplication() {
    return {
        cover_letter: `Dear Sir/Madam, \n
            My name is ${faker.person.firstName()} ${faker.person.lastName()} and I am applying for the position of ${faker.person.jobTitle()} at ${faker.company.name()}. \n
            ${faker.lorem.paragraph({ min: 2, max: 5 })}
        Yours sincerely, \n
        ${faker.person.firstName()} ${faker.person.lastName()}`
    }
};

module.exports = {
    generateJobApplication,
};