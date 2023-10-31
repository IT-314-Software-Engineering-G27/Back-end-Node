const { faker } = require('@faker-js/faker');

function generateSkills() {
    const num_skills = faker.number.int({ min: 1, max: 10 });
    let skills = [];
    for (let i = 0; i < num_skills; i++) {
        skills.push(faker.commerce.product());
    }
    return skills;
}

function generateIndividual() {
    return {
        first_name: faker.person.prefix() + faker.person.firstName(),
        last_name: faker.person.lastName(),
        college: `${faker.location.county()} University`,
        country: faker.location.country(),
        age: faker.number.int({ min: 18, max: 40 }),
        bio: faker.helpers.uniqueArray(faker.word.sample, faker.number.int({ min: 18, max: 40 })).join(' '),
        degree: `${faker.person.jobArea()} ${faker.person.jobType()}`,
        skills: generateSkills(),
    }
};

module.exports = {
    generateIndividual,
};