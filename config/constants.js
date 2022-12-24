// Creating constants object
const constants = {};

// User roles constants
const roles = ['admin', 'user'];

// URL protocol constants
const protocol = ['HTTP', 'HTTPS', 'TCP'];

// Status report constants
const status = ['available', 'error'];

// Adding properties to constants object
constants.roles = roles;
constants.protocol = protocol;
constants.status = status;

// Export constants
module.exports = constants;
