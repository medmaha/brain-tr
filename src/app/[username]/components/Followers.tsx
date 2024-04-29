"use client";
import { UserDetailsInterface } from "@/server/controllers/users";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { ProfileContext } from "../contexts/profile";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FollowCard from "./FollowCard";

type Props = {
  user: AuthUser;
  profile: UserDetailsInterface;
};

export default function Followers(props: Props) {
  const context = useContext(ProfileContext);
  const router = useRouter();

  return (
    <div className="sm:grid my-8 sm:gap-4 sm:space-y-0 space-y-4 sm:grid-cols-2 md:grid-cols-3 max-w-[850px] mx-auto">
      {context.followers?.map((data) => {
        return (
          <FollowCard
            page="followers"
            key={data.follower.username}
            data={data.follower}
            isFollowing={(data as any).isFollowing}
            user={props.user}
          />
        );
      })}
      {context.followers?.length === 0 && (
        <p className="text-center">No followers yet</p>
      )}

      {!context.followers && <p className="text-center">Loading...</p>}
    </div>
  );
}
