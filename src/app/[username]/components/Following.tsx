"use client";
import { UserDetailsInterface } from "@/server/controllers/users";
import React, { useContext } from "react";
import { ProfileContext } from "../contexts/profile";
import FollowCard from "./FollowCard";

type Props = {
  user: AuthUser;
  profile: UserDetailsInterface;
};

export default function Following(props: Props) {
  const context = useContext(ProfileContext);

  return (
    <div className="sm:grid my-8 sm:gap-4 sm:space-y-0 space-y-4 sm:grid-cols-2 md:grid-cols-3 max-w-[900px] mx-auto">
      {context.followings?.map((data) => {
        return (
          <FollowCard
            page="following"
            key={data.account.username}
            data={data.account}
            user={props.user}
            isFollowing={(data as any).isFollowing}
          />
        );
      })}
    </div>
  );
}
