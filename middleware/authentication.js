const CustomAPIError = require('../errors/index');
const { isTokenValid } = require('../utils/index');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
        throw new CustomAPIError.UnauthenticatedError('Authentication Invalid')
    }
    try {
        const { name, userId, role } = isTokenValid({ token });
        req.user = { name, userId, role }
        next();
    } catch (error) {
        throw new CustomAPIError.UnauthenticatedError('Authentication Invalid')
    }
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomAPIError.UnautorizedError('Unauthorize to access this route')
        }
        next();
    }
};

module.exports = { authenticateUser, authorizePermissions };