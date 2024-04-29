"use client";

import { UserDetailsInterface } from "@/server/controllers/users";
import React, { useCallback, useEffect, useState } from "react";
import { getFollowers, getFollowings } from "../actions";
import {
  FollowersInterface,
  FollowingsInterface,
} from "@/server/controllers/followers";

type ProfileContextProviderProps = {
  user: AuthUser;
  profile: UserDetailsInterface;
  children: React.ReactNode;
};

const followCached = new Map();

// prettier-ignore
export default function ProfileContextProvider({user, profile, children}: ProfileContextProviderProps) {
  const [ready ,setReady] = useState(false)
    const [followers, setFollowers] = React.useState<FollowersInterface>([]);
    const [followings, setFollowings] = React.useState<FollowingsInterface>([]);

  function updateUser(_user: AuthUser) {}

  const fetchFollowers = useCallback(async (cached=true) => {
    const cachedId = profile!.username+"_followers"
      if (followCached.has(cachedId) && cached){
        setFollowers(followCached.get(cachedId)!)
        return
      } 
      const _followers = await getFollowers(profile!.username);
      if (_followers.success){
        const data = _followers.data || []
        followCached.set(cachedId, data)
        setFollowers(data)
      }
  },[ profile])

  const fetchFollowings = useCallback(async (cached=true) => {
      const cachedId = profile!.username+"_followings"
      if (followCached.has(cachedId) && cached){
        setFollowings(followCached.get(cachedId)!)
        return
      } 
      const _followings = await getFollowings(profile?.username!);
      if (_followings.success){
        const data = _followings.data || []
        followCached.set(cachedId, data)
        setFollowings(data)
      }
  },[profile])

  const fetchFollows = useCallback(async () => {
    await Promise.all([fetchFollowers(), fetchFollowings()])
    setReady(true)
  }, []);

  const refetch = useCallback(async (followers:boolean) => {
    if (followers){
      await fetchFollowers(false)
    }else{
      await fetchFollowings(false)
    }
  },[fetchFollowers, fetchFollowings])

  function updateFollowers(followers:FollowersInterface) {
    setFollowers(followers)
  }

  function amIFollowing(username: string) {
    return followers?.some((follower) => follower.follower.username === username) || false
  }

  useEffect(()=>{
    fetchFollows()
  },[fetchFollows])

  return (
    <ProfileContext.Provider value={{ ready, refetch, followers, followings, updateUser, amIFollowing, updateFollowers }}>
      {children}
    </ProfileContext.Provider>
  );
}

type ProfileContextType = {
  ready: boolean;
  followers: FollowersInterface;
  followings: FollowingsInterface;
  amIFollowing: (username: string) => boolean;
  updateUser: (user: AuthUser) => void;
  refetch: (followers: boolean) => void;
  updateFollowers: (followers: FollowersInterface) => void;
};

export const ProfileContext = React.createContext({} as ProfileContextType);
