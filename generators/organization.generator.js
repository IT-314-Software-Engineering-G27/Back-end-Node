const { faker } = require("@faker-js/faker");

function generateOrganization() {
    return {
        company_name: faker.company.name(),
        CEOname: faker.person.fullName(),
        description: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 30, max: 40 })).join(' '),
        headquarter_location: `${faker.location.secondaryAddress()} ${faker.location.city()} ${faker.location.country()}`,
        year_of_establishment: faker.date.past({ years: 150, refDate: '2021-01-01' }).getFullYear(),
    }
};

module.exports = {
    generateOrganization,
};