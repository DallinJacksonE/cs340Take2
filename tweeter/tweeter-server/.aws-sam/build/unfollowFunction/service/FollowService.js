"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async loadMoreFollowers(token, userAlias, pageSize, lastFollowerAlias) {
        // TODO: Milestone 4 - Replace with actual database interaction
        const lastFollower = lastFollowerAlias
            ? tweeter_shared_1.FakeData.instance.findUserByAlias(lastFollowerAlias)
            : null;
        return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
    }
    async loadMoreFollowees(token, userAlias, pageSize, lastFolloweeAlias) {
        // TODO: Milestone 4 - Replace with actual database interaction
        const lastFollowee = lastFolloweeAlias
            ? tweeter_shared_1.FakeData.instance.findUserByAlias(lastFolloweeAlias)
            : null;
        return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias);
    }
}
exports.FollowService = FollowService;
