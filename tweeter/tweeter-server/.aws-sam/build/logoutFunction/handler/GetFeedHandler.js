"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../service/StatusService");
const handler = async (request) => {
    const statusService = new StatusService_1.StatusService();
    const [statuses, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem ? request.lastItem.timestamp : null);
    const statusDtos = statuses.map((status) => ({
        post: status.post,
        user: {
            firstName: status.user.firstName,
            lastName: status.user.lastName,
            alias: status.user.alias,
            imageUrl: status.user.imageUrl,
        },
        timestamp: status.timestamp,
    }));
    return new tweeter_shared_1.PagedStatusItemResponse(true, statusDtos, hasMore, null);
};
exports.handler = handler;
