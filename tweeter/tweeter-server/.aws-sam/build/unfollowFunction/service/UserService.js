"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const crypto = __importStar(require("crypto"));
class UserService {
    async getUser(token, userAlias) {
        // TODO: Milestone 4 - Replace with actual database interaction
        return tweeter_shared_1.FakeData.instance.findUserByAlias(userAlias);
    }
    async getIsFollowerStatus(token, followerAlias, followeeAlias) {
        // TODO: Milestone 4 - Replace with actual database interaction
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    async getFollowerCount(token, userAlias) {
        // TODO: Milestone 4 - Replace with actual database interaction
        return tweeter_shared_1.FakeData.instance.getFollowerCount(userAlias);
    }
    async getFolloweeCount(token, userAlias) {
        // TODO: Milestone 4 - Replace with actual database interaction
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(userAlias);
    }
    async follow(token, userToFollowAlias) {
        // TODO: Milestone 4 - Replace with actual database interaction
        const followerCount = await this.getFollowerCount(token, userToFollowAlias);
        const followeeCount = await this.getFolloweeCount(token, userToFollowAlias);
        return [followerCount, followeeCount];
    }
    async unfollow(token, userToUnfollowAlias) {
        // TODO: Milestone 4 - Replace with actual database interaction
        const followerCount = await this.getFollowerCount(token, userToUnfollowAlias);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollowAlias);
        return [followerCount, followeeCount];
    }
    async login(alias, password) {
        // TODO: Milestone 4 - Replace with actual database interaction
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("User not found");
        }
        const authToken = tweeter_shared_1.FakeData.instance.authToken;
        return [user, authToken];
    }
    async register(firstName, lastName, alias, password, userImageBytes) {
        const salt = crypto.randomBytes(16).toString("base64");
        const hashedPassword = crypto
            .createHash("sha256")
            .update(password + salt)
            .digest("base64");
        // TODO: Milestone 4 - Save the alias, firstName, lastName, userImageBytes, salt, and hashedPassword to DynamoDB
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("User not found");
        }
        const authToken = tweeter_shared_1.FakeData.instance.authToken;
        return [user, authToken];
    }
    async logout(token) {
        // TODO: Milestone 4 - Replace with actual database interaction
    }
}
exports.UserService = UserService;
