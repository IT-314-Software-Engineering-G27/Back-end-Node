const { BadRequestError } = require('../../errors');
const { validateUser, transformInputToUser } = require("./user.utils");

function validateOrganization({ organization }) {
    console.log(organization)
    if (!organization)
        throw new BadRequestError('Organization is not defined');
    if (!validateCEOname(organization.CEOname))
        throw new BadRequestError('CEOname is not valid');
    validateUser({user:organization.user});
}

function validateCEOname(CEOname) {
    if (!CEOname)
        return false;
    return /^[a-zA-Z\s]+$/.test(CEOname);
}

function transformInputToOrganization({ organization }) {
    organization.user.role = 'organization';
    if (!organization)
        throw new InternalServerError('User is not defined');
    return {
        user: transformInputToUser({ user: organization.user }),
        company_name: organization.company_name,
        CEOname: organization.CEOname,
        description: organization.description || null,
        headquater_location: organization.headquater_location || null,
        year_of_establishment: organization.year_of_establishment,
    }
};

module.exports = {
    validateOrganization,
    transformInputToOrganization,
};