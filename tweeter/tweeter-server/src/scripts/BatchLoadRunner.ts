import { FillFollowTableDao } from "./FillFollowTableDao";
import { FillUserTableDao } from "./FillUserTableDao";
import { User } from "tweeter-shared";

// ⚠️ IMPORTANT: Register this user normally in your app first so they exist!
const targetUserAlias = "@dj";
const followerPassword = "password";
const followerImageUrl =
  "https://imgs.search.brave.com/m9UdSF0dg_Wt0gQSzEdv4kmtydQMW6u77RSZT-Dzzck/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNC9Qb2tl/bW9uLVBva2ViYWxs/LVBORy1GcmVlLUlt/YWdlLnBuZw";

const numbUsersToCreate = 10000;
const batchSize = 25;

const fillUserTableDao = new FillUserTableDao();
const fillFollowTableDao = new FillFollowTableDao();

async function main() {
  console.log("Starting batch load...");

  for (let i = 0; i < numbUsersToCreate; i += batchSize) {
    const batchUsers = createUserBatch(
      i,
      Math.min(i + batchSize, numbUsersToCreate),
    );

    await fillUserTableDao.createUsers(batchUsers, followerPassword);
    await fillFollowTableDao.createFollows(targetUserAlias, batchUsers);

    if ((i + batchSize) % 1000 === 0) {
      console.log(`Created ${i + batchSize} users and follows`);
    }
  }

  console.log("Updating target user's follower count...");
  await fillUserTableDao.increaseFollowersCount(
    targetUserAlias,
    numbUsersToCreate,
  );
  console.log("Done!");
}

function createUserBatch(start: number, end: number): User[] {
  const users: User[] = [];
  for (let i = start + 1; i <= end; ++i) {
    users.push(
      new User(
        `Hungry${i}`,
        `Pokeball${i}`,
        `@catchem'all${i}`,
        followerImageUrl,
      ),
    );
  }
  return users;
}

main().catch(console.error);
