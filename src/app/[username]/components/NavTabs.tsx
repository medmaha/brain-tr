"use client";
import { UserDetailsInterface } from "@/server/controllers/users";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { ProfileContext } from "../contexts/profile";

type Props = {
  user: AuthUser;
  profile: UserDetailsInterface;
};

export default function NavTabs({ profile }: Props) {
  const context = React.useContext(ProfileContext);
  const searchParams = useSearchParams();

  return (
    <nav className="card py-4 rounded-xl text-sm max-w-[800px] mx-auto flex justify-center space-x-8">
      <>
        <Link
          className={`${
            searchParams.get("tab") === "about"
              ? "text-primary border-b-2 border-primary"
              : ""
          } hover:text-primaryHover transition-all`}
          href={`?tab=about`}
        >
          About
        </Link>
        <Link
          className={`${
            searchParams.get("tab") === "posts"
              ? "text-primary border-b-2 border-primary"
              : ""
          } hover:text-primaryHover transition-all`}
          href={`?tab=posts`}
        >
          Posts {profile?.postsCount}
        </Link>
        <Link
          className={`${
            searchParams.get("tab") === "followers"
              ? "text-primary border-b-2 border-primary"
              : ""
          } hover:text-primaryHover transition-all`}
          href={`?tab=followers`}
        >
          {`Followers ${context.followers && context.followers.length}`}
        </Link>
        <Link
          className={`${
            searchParams.get("tab") === "following"
              ? "text-primary border-b-2 border-primary"
              : ""
          } hover:text-primaryHover transition-all`}
          href={`?tab=following`}
        >
          {`Following ${context.followings && context.followings.length}`}
        </Link>
      </>
    </nav>
  );
}
