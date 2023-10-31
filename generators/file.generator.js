const { faker } = require('@faker-js/faker');
function generateOrganizationImage() {
    return {
        url: faker.image.urlLoremFlickr({
            width: 480,
            height: 480,
            category: 'business',
        }),
    };
}

function generateIndividualImage() {
    return {
        url: faker.image.avatarGitHub(),
    };
}

module.exports = {
    generateOrganizationImage,
    generateIndividualImage,
};