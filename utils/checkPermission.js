const CustomAPIError = require('../errors/index');

const checkPermission = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin') return;
    if (resourceUserId.toString() === requestUser.userId) return;
    throw new CustomAPIError.UnautorizedError('Not authorize to access this route');
};

module.exports = checkPermission;
