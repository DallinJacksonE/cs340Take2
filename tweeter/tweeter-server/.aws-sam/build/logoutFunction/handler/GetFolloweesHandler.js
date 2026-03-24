"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const handler = async (request) => {
    let lastItem = null;
    if (request.lastItem) {
        lastItem = new tweeter_shared_1.User(request.lastItem.firstName, request.lastItem.lastName, request.lastItem.alias, request.lastItem.imageUrl);
    }
    const [users, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(lastItem, request.pageSize, request.userAlias);
    const userDtos = users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
    }));
    return new tweeter_shared_1.PagedUserItemResponse(true, userDtos, hasMore, null);
};
exports.handler = handler;
