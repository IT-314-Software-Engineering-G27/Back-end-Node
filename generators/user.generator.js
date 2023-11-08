const { faker } = require('@faker-js/faker');
function generateUser({ first_name, last_name }) { 
    return {
        username: faker.internet.displayName({ firstName: first_name, lastName: last_name }) + faker.string.alphanumeric({ length: 5}),
        email: faker.internet.email({ firstName: first_name, lastName: last_name, provider: 'gmail.com' }),
        password: faker.internet.password({ length: 10, prefix: 'Aa1@' }),
        profile_picture: faker.image.avatar(),
        phone_number: `+${faker.number.int({ min: 1, max: 360 })}  ${faker.phone.number()}`,
    };
}

module.exports = {
    generateUser,
}