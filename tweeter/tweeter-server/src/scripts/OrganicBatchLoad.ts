import { DynamoUserDAO } from "../db/DAOs/DynamoDBDAOs/DynamoUserDAO";
import { DynamoFollowDAO } from "../db/DAOs/DynamoDBDAOs/DynamoFollowDAO";
import * as bcrypt from "bcryptjs";

// Initialize your actual DAOs
const userDAO = new DynamoUserDAO();
const followDAO = new DynamoFollowDAO(userDAO);

// ⚠️ Make sure this EXACTLY matches your logged-in test user
const targetUserAlias = "@dj";
const numbUsersToCreate = 10000;
const concurrencyLimit = 15; // How many to create at the exact same time

async function main() {
	console.log("Starting Organic Data Generation...");

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash("password", salt);

	// 1. Verify the target user actually exists in the database first!
	const targetUser = await userDAO.getUser(targetUserAlias);
	if (!targetUser) {
		console.error(`Target user ${targetUserAlias} does not exist!`);
		console.error("Please log into the app and register this user first.");
		return; // Stop the script so we don't create orphaned data
	}

	// 2. Create and follow in concurrent batches
	for (let i = 0; i < numbUsersToCreate; i += concurrencyLimit) {
		const promises = [];
		for (let j = 1; j <= concurrencyLimit && i + j <= numbUsersToCreate; j++) {
			const index = i + j;
			promises.push(createAndFollow(index, hashedPassword, salt));
		}

		await Promise.all(promises);
		console.log(
			`Successfully organically created and followed: ${i + promises.length} / ${numbUsersToCreate}`,
		);
	}

	// 3. Manually bump the target user's follower count to reflect the 10k users
	console.log("Updating target user's follower count...");
	await userDAO.updateFollowersCount(targetUserAlias, numbUsersToCreate);
	console.log("Done! Data is 100% organic and matches your app's DAOs.");
}

async function createAndFollow(
	index: number,
	hashedPassword: string,
	salt: string,
) {
	const alias = `@gottacatchem'all${index}`;
	const firstName = `hungry`;
	const lastName = `pokeball${index}`;
	const imageUrl =
		"https://imgs.search.brave.com/m9UdSF0dg_Wt0gQSzEdv4kmtydQMW6u77RSZT-Dzzck/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNC9Qb2tl/bW9uLVBva2ViYWxs/LVBORy1GcmVlLUlt/YWdlLnBuZw";

	// 1. Create the user using the actual DAO
	await userDAO.putUser(
		firstName,
		lastName,
		alias,
		hashedPassword,
		salt,
		imageUrl,
	);

	// 2. Follow the target user using the actual DAO (This also validates both users exist!)
	await followDAO.follow(alias, targetUserAlias);

	// 3. Update the fake follower's followee count
	await userDAO.updateFolloweesCount(alias, 1);
}

main().catch(console.error);
