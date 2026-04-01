1. users Table
   Purpose: To store all information directly related to a user's profile.
   Primary Key:
   Partition Key: alias (String)
   Attributes:
   alias: The user's unique alias.
   firstName: User's first name.
   lastName: User's last name.
   imageUrl: URL to their profile picture in S3.
   hashedPassword: The user's hashed password.
   salt: The salt used for hashing the password.
   followersCount: The number of users following this user.
   followeesCount: The number of users this user is following.
   How it's used:
   GetItem using the alias to fetch a user's profile for display or for login authentication.
   UpdateItem to change follower/followee counts when a follow/unfollow action occurs.
2. authtokens Table
   Purpose: To store session authentication tokens. These are temporary and should expire.
   Primary Key:
   Partition Key: token (String)
   Attributes:
   token: The unique auth token string.
   alias: The alias of the user it belongs to
   timestamp: When the token was created.
   ttl: A timestamp (in epoch seconds) for when the token should expire. You will need to enable Time to Live (TTL) on this attribute in DynamoDB settings.
   How it's used:
   PutItem to store a new token on login/register.
   GetItem to validate a token for an authenticated request. If the item doesn't exist, it's because it expired and was automatically deleted by DynamoDB's TTL feature.
   DeleteItem to invalidate a token on logout.
3. follows Table
   Purpose: To manage the many-to-many relationship between users. This table needs to be queried in two directions: who a user follows (followees) and who follows a user (followers). This requires a Global Secondary Index (GSI).
   Primary Key:
   Partition Key: followee_alias (The user being followed)
   Sort Key: follower_alias (The user doing the following)
   Global Secondary Index (GSI): follows_inverted_index
   Partition Key: follower_alias
   Sort Key: followee_alias
   Attributes:
   followee_alias, follower_alias
   followee_name, follower_name (denormalized for quick display)
   followee_imageUrl, follower_imageUrl (denormalized for quick display)
   How it's used:
   To get a user's followers, you Query the main table using the followee_alias.
   To get a user's followees, you Query the GSI using the follower_alias.
   To check if a follow relationship exists, you GetItem using both followee_alias and follower_alias.
4. statuses Table
   Purpose: To store every status a user posts. This represents the user's "Story".
   Primary Key:
   Partition Key: user_alias (The author of the status)
   Sort Key: timestamp (Number, for reverse chronological sorting)
   Attributes:
   user_alias, timestamp
   post: The text content of the status.
   user_firstName, user_lastName, user_imageUrl (denormalized user data)
   How it's used:
   Query using the user_alias to get a paginated list of a user's statuses for their story tab.
5. feed Table
   Purpose: To store the pre-computed feed for every user. This is a key performance requirement.
   Primary Key:
   Partition Key: user_alias (The owner of the feed)
   Sort Key: timestamp (Number, the timestamp of the status)
   Attributes:
   user_alias, timestamp
   post: The text content of the status.
   author_alias: The alias of the user who wrote the status.
   author_firstName, author_lastName, author_imageUrl (denormalized author data)
   How it's used:
   When a user posts a status, you get all of their followers from the follows table and perform a BatchWriteItem to add that status to the feed of each follower.
   To get a user's feed, you Query this table using their user_alias.
