"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const handler = async (request) => {
    let lastItem = null;
    if (request.lastItem) {
        lastItem = new tweeter_shared_1.Status(request.lastItem.post, new tweeter_shared_1.User(request.lastItem.user.firstName, request.lastItem.user.lastName, request.lastItem.user.alias, request.lastItem.user.imageUrl), request.lastItem.timestamp);
    }
    const [statuses, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastItem, request.pageSize);
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
