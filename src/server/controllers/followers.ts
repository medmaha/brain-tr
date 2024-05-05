import { sql } from "drizzle-orm";
import DB from "../db/connection";
import { followers as followers_model } from "../models/followers";
import { users } from "../models/users";

// prettier-ignore
export async function toggleUserFollow(_follower: string, _following: string) {
  const follower = await DB.query.users.findFirst({
    where: sql`username=${_follower}`,
  }); // The user who is following
  if (!follower) return null;

  const following = await DB.query.users.findFirst({
    where: sql`username=${_following}`,
  }); // The user you want to follow

  if (!following) return null;

  const followed = await DB.query.followers.findFirst({
    where: sql`follower_id=${follower.id} and user_id=${following.id}`
  })

  if (followed) {
    await Promise.all([
      DB.delete(followers_model).where(sql`follower_id=${follower.id} and user_id=${following.id}`),
      DB.update(users).set({ followersCount: sql`followers_count - 1` }).where(sql`id=${follower.id}`),
      DB.update(users).set({ followingCount: sql`following_count - 1` }).where(sql`id=${following.id}`),
    ])
    return 0
  }

  await Promise.all([
    DB.insert(followers_model).values({ userId: following.id, followerId: follower.id}),
    DB.update(users).set({ followingCount: sql`following_count + 1` }).where(sql`id=${follower.id}`),
    DB.update(users).set({ followersCount: sql`followers_count + 1` }).where(sql`id=${following.id}`)
  ])
  return 1
}

async function organizedData<T>(follows: any, authUser: any): Promise<T> {
  const followerIds = follows.map((follow: any) => follow.userId);

  followerIds.push(0);

  const isFollowingStatuses = await DB.query.followers.findMany({
    where: sql`follower_id=${authUser?.id} and user_id in (${sql.join(
      followerIds,
      sql`,`
    )})`,
  });

  const isFollowingMap = new Map(
    isFollowingStatuses.map((status) => [status.followerId, true])
  );

  const organized = follows.map((follow: any) => ({
    ...follow,
    isFollowing: isFollowingMap.get(authUser?.id || 0) || false,
  }));

  return organized as T;
}

// prettier-ignore
export async function getUserFollowers(username: string, limit = 10, authUsername: string) {
  const [user, authUser] = await Promise.all([
    DB.query.users.findFirst({ where: sql`username=${username}` }),
    authUsername ? DB.query.users.findFirst({ where: sql`username=${authUsername}` }) : null
  ]);

  if (!user || !authUser) return null;

  const followers = await DB.query.followers.findMany({
    limit,
    where: sql`user_id=${user.id}`,
    with: {
      follower: {
        columns: {
          id:true,
          username: true,
          name: true,
          avatar: true,
          followersCount: true,
        },
      },
    },
  });
  return await organizedData<typeof followers>(followers, authUser)
}

// prettier-ignore
export async function getUserFollowings(username: string, limit = 10, authUsername?: string) {

  const [user, authUser] = await Promise.all([
    DB.query.users.findFirst({ where: sql`username=${username}` }),
    authUsername ? DB.query.users.findFirst({ where: sql`username=${authUsername}` }) : null
  ]);

  if (!user || !authUser) return null;

  const followings = await DB.query.followers.findMany({
    limit,
    where: sql`follower_id=${user.id}`,
    with: {
      account: {
        columns: {
          username: true,
          name: true,
          avatar: true,
          followersCount: true,
        },
      },
    },
  });

  return await organizedData<typeof followings>(followings, authUser)

}

export type FollowersInterface = Awaited<ReturnType<typeof getUserFollowers>>;
export type FollowingsInterface = Awaited<ReturnType<typeof getUserFollowings>>;
