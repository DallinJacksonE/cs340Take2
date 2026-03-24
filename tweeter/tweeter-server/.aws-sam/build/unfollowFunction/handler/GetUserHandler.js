"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const user = await userService.getUser(request.token, request.userAlias);
    if (!user) {
        throw new Error("[bad-request] User not found");
    }
    return new tweeter_shared_1.GetUserResponse(true, {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
    }, null);
};
exports.handler = handler;
