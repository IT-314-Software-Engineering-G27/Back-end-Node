const { generateUser } = require('./user.generator');
const { generateIndividual } = require('./individual.generator');
const { generateOrganization } = require('./organization.generator');
const { generateJobProfile } = require('./jobProfile.generator');
const { generateJobApplication } = require('./jobApplication.generator');
const { generateConnection, generateMessage } = require('./connection.generator');
const { generatePost } = require('./post.generator');
const { generateEvent, generateRegistration } = require('./event.generator');

const fs = require('fs');
const { createIndividual } = require('../services/individual.service');
const { createOrganization } = require('../services/organization.service');
const { createJobProfile } = require('../services/jobProfile.service');
const { createJobApplication } = require('../services/jobApplication.service');
const { createConnection } = require('../services/connection.service');
const { createMessage } = require('../services/message.service');
const { createPost, likePost } = require('../services/post.service');
const { createEvent, registerForEvent } = require('../services/event.service');
const { faker } = require('@faker-js/faker');

const NUM_OF_INDIVIDUALS = 200;
const NUM_OF_ORGANIZATIONS = 200;
const NUM_OF_JOB_PROFILES = 150;
const NUM_OF_POSTS = 300;
const NUM_OF_EVENTS = 100;
const NUM_OF_USERS = NUM_OF_INDIVIDUALS + NUM_OF_ORGANIZATIONS;

module.exports = async () => {
    const individuals = new Array(NUM_OF_INDIVIDUALS);
    individuals.fill({});
    const organizations = new Array(NUM_OF_ORGANIZATIONS);
    organizations.fill({});
    const connections = [];
    const posts = new Array(NUM_OF_POSTS);
    posts.fill({});
    const events = new Array(NUM_OF_EVENTS);
    events.fill({});
    const users = [];
    const userIds = [];
    const names = new Set();

    const individualIds = await Promise.all(individuals.map(async () => {
        let individual = generateIndividual();
        while (names.has({
            first_name: individual.first_name,
            last_name: individual.last_name
        })) {
            individual = generateIndividual();
        };
        names.add({
            first_name: individual.first_name,
            last_name: individual.last_name
        });
        const genUser = generateUser({ first_name: individual.first_name, last_name: individual.last_name });
        individual.user = genUser;
        users.push({
            email: genUser.email,
            password: genUser.password
        });
        const { _id, user } = await createIndividual({ individual });
        userIds.push(user);
        return _id;
    }));

    const organizationIds = await Promise.all(organizations.map(async () => {
        let organization = generateOrganization();
        while (names.has({
            first_name: organization.CEOname.split(' ').reverse()[0],
            last_name: organization.company_name
        })) {
            organization = generateOrganization();
        };
        names.add({
            first_name: organization.CEOname.split(' ').reverse()[0],
            last_name: organization.company_name
        });
        const genUser = generateUser({ first_name: organization.CEOname.split(' ').reverse()[0], last_name: organization.company_name });
        genUser.role = 'organization';
        users.push({
            email: genUser.email,
            password: genUser.password
        });
        organization.user = genUser;
        const { _id, user } = await createOrganization({ organization });
        userIds.push(user);
        return _id;
    }));

    const auth_list = users.map((user) => {
        return {
            email: user.email,
            password: user.password
        };
    });

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

    const connectionFromIds = userIds.slice(0, (userIds.length / 2));
    const connectionToIds = userIds.slice((userIds.length / 2), userIds.length);

    connectionFromIds.forEach((userId1) => {
        connectionToIdsForUser1 = faker.helpers.arrayElements(connectionToIds, faker.number.int({ min: 2, max: 5 }));
        connectionToIdsForUser1.forEach((userId2) => {
            connections.push(generateConnection({ userId1, userId2 }));
        });
    });

    const connectionIds = await Promise.all(connections.map(async (connection) => {
        const { _id } = await createConnection({ connection });
        return _id;
    }));

    await Promise.all(connectionIds.map(async (connectionId) => {
        for (let i = 0; i < faker.number.int({ min: 20, max: 40 }); i++) {
            const message = generateMessage();
            await createMessage({ message, connectionId, role: faker.helpers.arrayElement(['from', 'to']) });
        }
    }));


    const postIds = await Promise.all(posts.map(async () => {
        const post = generatePost();
        const { _id } = await createPost({ post, userId: faker.helpers.arrayElement(userIds) });
        const numLikes = faker.number.int({ min: 0, max: 20 });
        const likedBy = faker.helpers.arrayElements(userIds, numLikes);
        await Promise.all(likedBy.map(async (userId) => {
            await likePost({ postId: _id, userId });
        }));
        return _id;
    }));

    const eventIds = await Promise.all(events.map(async () => {
        const event = generateEvent();
        const { _id } = await createEvent({ event });
        if (event.last_registration_date < Date.now()) {
            return _id;
        }
        const numRegistrations = faker.number.int({ min: 0, max: 20 });
        const registeredBy = faker.helpers.arrayElements(organizationIds, numRegistrations);
        await Promise.all(registeredBy.map(async (organizationId) => {
            const registration = generateRegistration();
            await registerForEvent({ eventId: _id, organizationId, registration });
        }));
    }));

    fs.writeFileSync('./generators/auth_list.json', JSON.stringify(auth_list));

    return auth_list;
};
