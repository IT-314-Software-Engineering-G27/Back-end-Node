const { generateUser } = require('./user.generator');
const { generateIndividual } = require('./individual.generator');
const { generateOrganization } = require('./organization.generator');
const { generateJobProfile } = require('./jobProfile.generator');
const { generateJobApplication } = require('./jobApplication.generator');
const { generateConnection, generateMessage } = require('./connection.generator');

const { createIndividual } = require('../services/individual.service');
const { createOrganization } = require('../services/organization.service');
const { createJobProfile } = require('../services/jobProfile.service');
const { createJobApplication } = require('../services/jobApplication.service');
const { createConnection } = require('../services/connection.service');
const { createMessage } = require('../services/message.service');
const { faker } = require('@faker-js/faker');

module.exports = async () => {
    const individuals = [];
    const organizations = [];
    const connections = [];

    const userIds = [];
    // create 500 individuals
    const names = [];
    for (let i = 0; i < 500; i++) {
        let individual = generateIndividual();
        while (names.includes({
            first_name: individual.first_name,
            last_name: individual.last_name
        })) {
            individual = generateIndividual();
        };
        names.push({
            first_name: individual.first_name,
            last_name: individual.last_name
        });
        const user = generateUser({ first_name: individual.first_name, last_name: individual.last_name });
        individual.user = user;
        individuals.push(individual);
    }

    const individualIds = await Promise.all(individuals.map(async (individual) => {
        const { _id, user } = await createIndividual({ individual });
        userIds.push(user);
        return _id;
    }));

    // create 200 organizations
    for (let i = 0; i < 200; i++) {
        let organization = generateOrganization();
        while (names.includes({
            first_name: organization.CEOname.split(' ').reverse()[0],
            last_name: organization.company_name
        })) {
            organization = generateOrganization();
        };
        names.push({
            first_name: organization.CEOname.split(' ').reverse()[0],
            last_name: organization.company_name
        });
        const user = generateUser({ first_name: organization.CEOname.split(' ').reverse()[0], last_name: organization.company_name });
        organization.user = user;
        organizations.push(organization);
    }

    const organizationIds = await Promise.all(organizations.map(async (organization) => {
        const { _id, user } = await createOrganization({ organization });
        userIds.push(user);
        return _id;
    }));

    const organizationWithJobProfileIds = faker.helpers.arrayElements(organizationIds, 100);

    const jobProfileIds = await Promise.all(organizationWithJobProfileIds.map(async (organizationId) => {
        const jobProfile = generateJobProfile();
        const { _id } = await createJobProfile({ jobProfile, organizationId });
        return _id;
    }));

    await Promise.all(jobProfileIds.map(async (jobProfileId) => {
        const applicants = faker.helpers.arrayElements(individualIds, faker.number.int({ min: 5, max: 20 }));
        await Promise.all(applicants.map(async (applicant) => {
            const jobApplication = generateJobApplication();
            await createJobApplication({ jobApplication, jobProfileId, individualId: applicant });
        }));
    }));

    const user1List = faker.helpers.arrayElements(userIds, 200);
    const user2List = faker.helpers.arrayElements(userIds, 200);

    for (let i = 0; i < 200; i++) {
        const connection = generateConnection({ userId1: user1List[i], userId2: user2List[i] });
        connections.push(connection);
    }

    const connectionIds = await Promise.all(connections.map(async (connection) => {
        const { _id } = await createConnection({ connection });
        return _id;
    }));

    await Promise.all(connectionIds.map(async (connectionId) => {
        for (let i = 0; i < faker.number.int({ max: 20 }); i++) {
            const message = generateMessage();
            await createMessage({ message, connectionId, role: faker.helpers.arrayElement(['from', 'to']) });
        }
    }));
    return '';
};
