"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const handler = async (request) => {
    // For Milestone 3, we just return dummy data from FakeData
    const user = tweeter_shared_1.FakeData.instance.firstUser;
    const authToken = tweeter_shared_1.FakeData.instance.authToken;
    if (!user || !authToken)
        throw new Error("[internal-server-error] Registration failed");
    return new tweeter_shared_1.AuthenticateResponse(true, {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl,
    }, {
        token: authToken.token,
        timestamp: authToken.timestamp,
    }, null);
};
exports.handler = handler;
