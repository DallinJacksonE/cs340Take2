"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async login(alias, password) {
        // TODO: Milestone 4 - Replace with actual database interaction
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("User not found");
        }
        const authToken = tweeter_shared_1.FakeData.instance.authToken;
        return [user, authToken];
    }
}
exports.UserService = UserService;
