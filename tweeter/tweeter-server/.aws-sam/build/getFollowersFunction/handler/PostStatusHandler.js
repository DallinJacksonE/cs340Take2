"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../service/StatusService");
const handler = async (request) => {
    const statusService = new StatusService_1.StatusService();
    const status = new tweeter_shared_1.Status(request.newStatus.post, new tweeter_shared_1.User(request.newStatus.user.firstName, request.newStatus.user.lastName, request.newStatus.user.alias, request.newStatus.user.imageUrl), request.newStatus.timestamp);
    await statusService.postStatus(request.token, status);
    return new tweeter_shared_1.TweeterResponse(true, null);
};
exports.handler = handler;
