"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const count = await userService.getFollowerCount(request.token, request.userAlias);
    return new tweeter_shared_1.GetFollowerCountResponse(true, count, null);
};
exports.handler = handler;
