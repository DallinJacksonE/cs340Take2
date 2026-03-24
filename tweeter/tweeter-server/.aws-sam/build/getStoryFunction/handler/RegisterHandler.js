"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const [user, authToken] = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes);
    if (!user || !authToken)
        throw new Error("[internal-server-error] Registration failed");
    return new tweeter_shared_1.AuthenticateResponse(true, {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
    }, {
        token: authToken.token,
        timestamp: authToken.timestamp,
    }, null);
};
exports.handler = handler;
