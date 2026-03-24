# Tweeter Server (AWS Backend)

This project contains the backend serverless implementation for the Tweeter application. It leverages AWS API Gateway and AWS Lambda to handle client requests using a remote procedure call (RPC) architectural style.

## Code Overview

The server is written in TypeScript and runs on Node.js 20.x in AWS Lambda. It is structured into multiple layers:

- **Handlers (`src/handler`)**: The entry points for the AWS Lambda functions. They parse the incoming HTTP POST request bodies, extract the necessary data, and pass it to the service layer.
- **Services (`src/service`)**: Contain the core business logic (e.g., hashing passwords, managing user sessions, fetching feeds).
- **Shared/Common**: Types and interfaces (like `User`, `AuthToken`, and `Status`) shared between the client and server.
- **Infrastructure (`template.yml`)**: An AWS SAM (Serverless Application Model) template that defines the API Gateway definitions, Lambda functions, Lambda layers, and DynamoDB tables.

## Deployment (`./deploy`)

The `./deploy` script is an automated script to package and deploy this serverless architecture to AWS. It performs the following steps:

1. **Compile**: Transpiles the TypeScript code into JavaScript (`tsc` or `esbuild`) and outputs it to a `dist/` directory.
2. **Package Layer**: Copies `node_modules` (and shared dependencies) into the `layer/nodejs/` directory so they can be uploaded as an AWS Lambda Layer. This keeps the function packages small and reuses code.
3. **Build**: Runs `sam build` to read the `template.yml` and prepare the deployment artifacts.
4. **Deploy**: Runs `sam deploy` to push the CloudFormation stack to AWS, creating or updating the API Gateway, Lambda functions, and DynamoDB tables in the cloud.

---

## API Documentation

Below is the documentation for the Web API endpoints defined in the AWS API Gateway. All endpoints use the `POST` HTTP method and expect request parameters in a JSON body.

### Standard HTTP Status Codes

All endpoints below return the following standard integration responses:

- **200 (OK)**: The request was successful, and the expected data is returned.
- **400 (Bad Request)**: The request is malformed, missing required parameters (e.g., an empty login alias), or the parameters are invalid.
- **401 (Unauthorized)**: The provided authentication token is invalid or expired.
- **500 (Internal Server Error)**: An unexpected error occurred on the server while processing the request.

---

### 1. `/login`

**Description:** Authenticates a user with the provided alias and password.

- **Request Body:** `{ "alias": "<alias>", "password": "<password>" }`
- **Responses:** 200, 400, 500

### 2. `/register`

**Description:** Signs up a new user, hashes their password, stores their profile image, and returns the newly created User profile and an authorization token.

- **Request Body:** `{ "firstName": "<First>", "lastName": "<Last>", "alias": "<alias>", "password": "<password>", "userImageBytes": "<base64_string>" }`
- **Responses:** 200, 400, 500

### 3. `/logout`

**Description:** Logs the user out by invalidating their active authorization token.

- **Request Body:** `{ "authToken": { "token": "<token_string>" } }`
- **Responses:** 200, 400, 500

### 4. `/getUser`

**Description:** Retrieves the public profile information for a specific user based on their alias.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "alias": "<target_alias>" }`
- **Responses:** 200, 400, 500

### 5. `/follow`

**Description:** Adds a follower relationship where the currently authenticated user begins following the specified target user.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "userToFollow": "<target_alias>" }`
- **Responses:** 200, 400, 500

### 6. `/unfollow`

**Description:** Removes a follower relationship where the currently authenticated user stops following the specified target user.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "userToUnfollow": "<target_alias>" }`
- **Responses:** 200, 400, 500

### 7. `/getIsFollowerStatus`

**Description:** Determines if a specific user (follower) is currently following another specified user (followee).

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "follower": "<alias>", "followee": "<target_alias>" }`
- **Responses:** 200, 400, 500

### 8. `/getFollowers`

**Description:** Retrieves a paginated list of users that follow the specified user.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "userAlias": "<alias>", "limit": 10, "lastFollowerAlias": "<alias_for_cursor>" }`
- **Responses:** 200, 400, 500

### 9. `/getFollowees`

**Description:** Retrieves a paginated list of users that the specified user is currently following.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "userAlias": "<alias>", "limit": 10, "lastFolloweeAlias": "<alias_for_cursor>" }`
- **Responses:** 200, 400, 500

### 10. `/getFollowerCount`

**Description:** Retrieves the total number of followers for a specified user.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "userAlias": "<alias>" }`
- **Responses:** 200, 400, 500

### 11. `/getFolloweeCount`

**Description:** Retrieves the total number of followees (people the user follows) for a specified user.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "userAlias": "<alias>" }`
- **Responses:** 200, 400, 500

### 12. `/postStatus`

**Description:** Sends and publishes a new status (tweet) to the currently authenticated user's story and triggers background processes to push the status to their followers' feeds.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "status": { "post": "Hello World", "user": { ... }, "datetime": 1699999999 } }`
- **Responses:** 200, 400, 500

### 13. `/getStory`

**Description:** Retrieves a paginated list of statuses posted by a specific user, ordered chronologically.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "userAlias": "<alias>", "limit": 10, "lastStatus": { ... } }`
- **Responses:** 200, 400, 500

### 14. `/getFeed`

**Description:** Retrieves a paginated list of statuses from all users the currently authenticated user follows, ordered chronologically.

- **Request Body:** `{ "authToken": { "token": "<token_string>" }, "userAlias": "<alias>", "limit": 10, "lastStatus": { ... } }`
- **Responses:** 200, 400, 500
