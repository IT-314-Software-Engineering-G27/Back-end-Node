const { generateUser } = require('./user.generator');
const { generateIndividual } = require('./individual.generator');
const { generateOrganization } = require('./organization.generator');
const { generateJobProfile } = require('./jobProfile.generator');
const { generateJobApplication } = require('./jobApplication.generator');
const { generateConnection, generateMessage } = require('./connection.generator');
const { generatePost } = require('./post.generator');

const { createIndividual } = require('../services/individual.service');
const { createOrganization } = require('../services/organization.service');
const { createJobProfile } = require('../services/jobProfile.service');
const { createJobApplication } = require('../services/jobApplication.service');
const { createConnection } = require('../services/connection.service');
const { createMessage } = require('../services/message.service');
const { createPost } = require('../services/post.service');

const { faker } = require('@faker-js/faker');

const NUM_OF_INDIVIDUALS = 500;
const NUM_OF_ORGANIZATIONS = 200;
const NUM_OF_JOB_PROFILES = 150;
const NUM_OF_CONNECTIONS = 250;
const NUM_OF_POSTS = 100;

module.exports = async () => {
    const individuals = [];
    const organizations = [];
    const connections = [];
    const posts = [];
    const userIds = [];
    const names = [];
    for (let i = 0; i < NUM_OF_INDIVIDUALS; i++) {
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

    for (let i = 0; i < NUM_OF_ORGANIZATIONS; i++) {
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
        user.role = 'organization';
        organization.user = user;
        organizations.push(organization);
    }

    const organizationIds = await Promise.all(organizations.map(async (organization) => {
        const { _id, user } = await createOrganization({ organization });
        userIds.push(user);
        return _id;
    }));

    const organizationWithJobProfileIds = faker.helpers.arrayElements(organizationIds, NUM_OF_JOB_PROFILES);

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

    const user1List = faker.helpers.arrayElements(userIds, NUM_OF_CONNECTIONS);
    const user2List = faker.helpers.arrayElements(userIds, NUM_OF_CONNECTIONS);

    for (let i = 0; i < NUM_OF_ORGANIZATIONS; i++) {
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

    for (let i = 0; i < NUM_OF_POSTS; i++) {
        const post = generatePost();
        const { _id } = await createPost({ post });
        posts.push(_id);
        
        const numLikes = faker.random.number({ min: 0, max: 50 });
        const likedBy = faker.helpers.arrayElements(userIds, numLikes);
        await Promise.all(likedBy.map(async (userId) => {
            await createLike({ postId: _id, userId });
        }));
    }
    

    return '';
};
