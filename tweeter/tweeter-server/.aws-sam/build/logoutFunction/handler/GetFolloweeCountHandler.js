"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const handler = async (request) => {
    const count = await tweeter_shared_1.FakeData.instance.getFolloweeCount(request.userAlias);
    return new tweeter_shared_1.GetFolloweeCountResponse(true, count, null);
};
exports.handler = handler;
