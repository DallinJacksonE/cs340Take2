"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../service/FollowService");
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const [users, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem ? request.lastItem.alias : null);
    const userDtos = users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
    }));
    return new tweeter_shared_1.PagedUserItemResponse(true, userDtos, hasMore, null);
};
exports.handler = handler;
