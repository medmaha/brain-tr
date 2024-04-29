import { getUserDetails } from "@/server/controllers/users";
import NavTabs from "./components/NavTabs";
import About from "./components/About";
import { Metadata } from "next";
import React from "react";
import Header from "./components/Header";
import Following from "./components/Following";
import Followers from "./components/Followers";
import Posts from "./components/Posts";
import { getAuthenticatedUser } from "@/lib/auth";
import ProfileContextProvider from "./contexts/profile";

const metadata: Metadata = {};

export default async function Page(props: PageProps) {
  const user = getAuthenticatedUser();

  if (!user) {
    return <>Not Logged In</>;
  }

  const username = props.params.username;
  const profile = await getUserDetails(username);

  if (!profile)
    return (
      <>
        <p className="mb-4 card mt-2 p-2 px-4 shadow w-[400px] mx-auto rounded-xl">
          <b className="pr-2">Username:</b> {username}
        </p>
      </>
    );

  const tab = props.searchParams.tab || "about";

  const validTabs = ["about", "posts", "following", "followers"];

  if (!validTabs.includes(tab)) {
    return (
      <div className="">
        <p className="">404 | Not found</p>
      </div>
    );
  }

  return (
    <ProfileContextProvider user={user} profile={profile}>
      <div className="max-w-[1000px] mx-auto px-2">
        <Header profile={profile} user={user} />
        <NavTabs user={user} profile={profile} />
        {tab === "about" && <About profile={profile} />}
        {tab === "posts" && <Posts profile={profile} />}
        {tab === "followers" && <Followers user={user} profile={profile} />}
        {tab === "following" && <Following user={user} profile={profile} />}

        {/* <main className="flex-1 container mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <TrendingPosts />
          <div className="space-y-6">
            <About />
            <Interest />
            <Friends />
          </div>
        </main> */}
      </div>
    </ProfileContextProvider>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const username = params.username;
  const user = await getUserDetails(username);
  const title = user ? `${user.name}` : "Viby | Entertainment";
  return {
    title,
    description: `${
      user?.biography || "Viby the ultimate entertainment platform"
    }`,
    keywords: [
      "Entertainment",
      "Platform",
      "musics",
      "videos",
      "photos",
      "chat",
      "audio",
    ],
  } as Metadata;
}
