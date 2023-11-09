const { faker } = require("@faker-js/faker");

function generateRequirements() {
    const num_req = faker.number.int({ min: 1, max: 10 });
    let req = [];
    for (let i = 0; i < num_skills; i++) {
        req.push(faker.lorem.words(3));
    }
    return req;
}


function generateEvent() {
    return {
        title: faker.person.title(),
        description: faker.lorem.sentences(3),
        start_time: faker.date.anytime(),
        end_time: faker.date.between({ from: start_time }), 
        last_registration_date: faker.date.between({ from: start_time, to: end_time }) , 
};
}

module.exports = {
    generateEvent,
};