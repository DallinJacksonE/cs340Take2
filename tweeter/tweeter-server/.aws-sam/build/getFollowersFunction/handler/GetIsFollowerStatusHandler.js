"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const isFollower = await userService.getIsFollowerStatus(request.token, request.follower.alias, request.followee.alias);
    return new tweeter_shared_1.GetIsFollowerStatusResponse(true, isFollower, null);
};
exports.handler = handler;
