"use server";

import { getAuthenticatedUser } from "@/lib/auth";
import {
  FollowersInterface,
  FollowingsInterface,
  getUserFollowers,
  getUserFollowings,
  toggleUserFollow,
} from "@/server/controllers/followers";
import { getPostForUser } from "@/server/controllers/posts";

// prettier-ignore
export async function getFollowers(username: string, limit = 10) :Promise<FormActionReturn<FollowersInterface>> {
  const user = getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      message: "Please log in first",
    };
  }
  const data = await getUserFollowers(username, limit, user.username);

  if (data) {

    return {
      data,
      success: true,
      message: "Followers fetched successfully",
    };
  }
  return {
    success: false,
    message: "Failed to fetch followers",
  };
}

// prettier-ignore
export async function getFollowings(username: string, limit = 10) :Promise<FormActionReturn<FollowingsInterface>> {
  const user  = getAuthenticatedUser();
  if (!user){
    return {
      success: false,
      message: "Please log in first",
    };
  }
  const data = await getUserFollowings(username, limit, user.username);

  if (data) {
    return {
      data,
      success: true,
      message: "Followers fetched successfully",
    };
  }
  return {
    success: false,
    message: "Failed to fetch followers",
  };
}

export async function toggleFollow(username: string) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      message: "Please log in first",
    };
  }

  const followed = await toggleUserFollow(user.username, username);

  if (followed === null) {
    return {
      success: false,
      message: "Failed to follow user",
    };
  }
  return followed === 1;
}

export async function getPosts(username: string) {
  return getPostForUser(username);
}
