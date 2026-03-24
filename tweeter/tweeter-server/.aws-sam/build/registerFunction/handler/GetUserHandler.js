"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const handler = async (request) => {
    // For Milestone 3, we just return dummy data from FakeData
    const user = tweeter_shared_1.FakeData.instance.findUserByAlias(request.userAlias); // Adapt 'userAlias' to match your DTO
    if (!user) {
        throw new Error("[bad-request] User not found");
    }
    return new tweeter_shared_1.GetUserResponse(true, {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
    }, null);
};
exports.handler = handler;
