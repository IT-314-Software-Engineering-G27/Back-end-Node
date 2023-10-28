const { validateUser, transformInputToUser } = require("./user.utils");


function validateIndividual({ individual }) {
    if (!individual) throw new Error('Individual is required');
    validateUser({ user: individual.user });
};

function transformInputToIndividual({ individual }) {
    individual.user.role = 'individual';
    if (!individual)
        throw new InternalServerError('User is not defined');
    return {
        user: transformInputToUser({ user: individual.user }),
        first_name: individual.first_name,
        last_name: individual.last_name,
        college: individual.college || null,
        country: individual.country || null,
        age: individual.age,
        bio: individual.bio || null,
        degree: individual.degree || null,
        skills: individual.skills || [],
    }
};

module.exports = {
    validateIndividual,
    transformInputToIndividual,
};