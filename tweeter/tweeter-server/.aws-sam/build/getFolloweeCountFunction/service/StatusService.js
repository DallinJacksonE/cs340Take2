"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class StatusService {
    async loadMoreStoryItems(token, userAlias, pageSize, lastItemTimestamp) {
        // TODO: Milestone 4 - Replace with actual database interaction
        return tweeter_shared_1.FakeData.instance.getPageOfStatuses(null, pageSize);
    }
    async loadMoreFeedItems(token, userAlias, pageSize, lastItemTimestamp) {
        // TODO: Milestone 4 - Replace with actual database interaction
        return tweeter_shared_1.FakeData.instance.getPageOfStatuses(null, pageSize);
    }
    async postStatus(token, newStatus) {
        // TODO: Milestone 4 - Replace with actual database interaction
    }
}
exports.StatusService = StatusService;
