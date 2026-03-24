"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../service/UserService");
const handler = async (request) => {
    try {
        const userService = new UserService_1.UserService();
        const [user, authToken] = await userService.login(request.alias, request.password);
        return new tweeter_shared_1.AuthenticateResponse(true, {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.alias,
            imageUrl: user.imageUrl,
        }, {
            token: authToken.token,
            timestamp: authToken.timestamp,
        }, null);
    }
    catch (error) {
        // API Gateway will catch errors that contain "[bad-request]" and return a 400 status code
        // or "[internal-server-error]" for a 500 status code as defined in your template.yml
        throw new Error(`[internal-server-error] ${error.message}`);
    }
};
exports.handler = handler;
