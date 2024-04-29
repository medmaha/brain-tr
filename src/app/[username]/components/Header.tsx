"use client";
import { UserDetailsInterface } from "@/server/controllers/users";
import Image from "next/image";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ProfileContext } from "../contexts/profile";
import { toggleFollow } from "../actions";
import toast from "react-hot-toast";

type Props = {
  user: AuthUser;
  profile: UserDetailsInterface;
};

export default function Header({ user, profile }: Props) {
  const context = useContext(ProfileContext);

  const isFollowing = useMemo(() => {
    if (context) return context.amIFollowing(user!.username);
    return false;
  }, [context, user]);

  const [following, toggleFollowing] = useState(isFollowing);

  async function follow() {
    if (profile?.username !== user.username) {
      const response = await toggleFollow(profile!.username);

      if (typeof response === "boolean") {
        toggleFollowing(response);
        context.refetch(true);
        return;
      }

      toast.error(response.message);
    }
  }

  useEffect(() => {
    toggleFollowing(isFollowing);
  }, [isFollowing]);

  return (
    <header className="py-8">
      <div className="max-w-[900px] w-full mx-auto flex justify-between items-center">
        <div className="space-x-4 flex items-center flex-wrap">
          {profile!.avatar ? (
            <div className="w-[96px] h-[96px] border rounded-full">
              <Image
                width={96}
                height={96}
                className="h-full w-full cursor-pointer hover:opacity-80 transition rounded-full post-author-img"
                src={profile!.avatar}
                alt={`${profile!.name}'s Avatar`}
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full card border flex items-center justify-center">
              <span className="text-gray-600 md:text-3xl">
                {profile!.name[0]}
                {(profile!.name.split(" ")[1] || [])[0] || ""}
              </span>
            </div>
          )}

          <div>
            <h1 className=" text-xl sm:text-xl md:text-2xl font-bold">
              {profile!.name}
            </h1>
            <p className="opacity-90">@{profile!.username}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 sm:gap-6 flex-wrap">
          {context.ready && profile?.username === user.username && (
            <button className="bg-primary text-sm hover:bg-primaryHover transition p-2 px-2.5 rounded-md">
              Edit Profile
            </button>
          )}
          {context.ready && profile?.username !== user.username && (
            <button
              onClick={follow}
              className={`${
                following
                  ? "bg-red-500 hover:bg-red-500/90"
                  : "bg-primary hover:bg-primaryHover"
              } hover:bg-primaryHover} text-sm p-2 rounded-md transition px-4`}
            >
              {!following ? "Follow" : "Unfollow"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
