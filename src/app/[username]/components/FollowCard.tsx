import React, { useContext, useEffect, useMemo, useState } from "react";
import { ProfileContext } from "../contexts/profile";
import Link from "next/link";
import Image from "next/image";
import { toggleFollow } from "../actions";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { FollowersInterface } from "@/server/controllers/followers";

type Props = {
  page: "following" | "followers";
  user: AuthUser;
  data: {
    name: string;
    username: string;
    avatar: string | null;
    followersCount: number;
  };
  isFollowing: boolean | null;
};

export default function FollowCard(props: Props) {
  const context = useContext(ProfileContext);
  const [pending, setPending] = useState(false);

  const isMe = useMemo(() => {
    return props.data.username === props.user?.username;
  }, [props.data.username, props.user?.username]);

  const [isFollowing, toggleFollowing] = useState(props.isFollowing);
  const [data, setData] = useState(props.data);

  let fullName = props.data.name.split(" ");

  async function follow() {
    if (props.user?.username !== props.data.username) {
      setPending(true);
      const response = await toggleFollow(props.data.username);
      setPending(false);
      if (typeof response === "boolean") {
        toggleFollowing(response);
        if (response === true)
          setData((prev) => ({
            ...prev,
            followersCount: prev.followersCount + 1,
          }));
        else
          setData((prev) => ({
            ...prev,
            followersCount: prev.followersCount - 1,
          }));
        // context.refetch(props.page === "followers");
        return;
      }
      toast.error(response.message);
    }
  }

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    toggleFollowing(props.isFollowing);
  }, [props.isFollowing]);

  return (
    <div
      className="card mx-auto max-w-[350px] w-full justify-center grid-cols-[auto,1fr,auto] items-center p-4 border rounded-md grid gap-4"
      key={data.username}
    >
      <div className="">
        <Link
          href={`/${data.username}`}
          className="w-[50px] inline-block h-[50px] rounded-full border overflow-hidden"
        >
          {data.avatar ? (
            <Image
              width={96}
              height={96}
              className="w-full h-full rounded-full post-author-img"
              src={data.avatar}
              alt={`${data.name}'s Avatar`}
            />
          ) : (
            <div className="w-full h-full rounded-full card border flex items-center justify-center">
              <span className="opacity-80 font-semibold text-xl">
                {data.name[0]}
                {(data.name.split(" ")[1] || "")[0] || ""}
              </span>
            </div>
          )}
        </Link>
      </div>
      <div className="">
        <div className="grid">
          <Link href={`/${data.username}`} className="inline-block">
            <p title={data.name} className="text-sm truncate">
              {!isMe ? <>{fullName[0] + ". " + fullName[1][0]}</> : "Me"}
            </p>
            <p className="text-sm opacity-80 truncate">@{data.username}</p>
          </Link>
          <p className="text-xs opacity-60 pt-2">
            <Link
              href={`/${data.username}?tab=followers`}
              className="opacity-70 hover:opacity-80"
            >
              Followers <b className="ml-0.5">{data.followersCount}</b>
            </Link>
          </p>
        </div>
      </div>
      <div className="pt-1">
        {!isMe && (
          <button
            onClick={follow}
            className={`${
              !isFollowing
                ? "bg-primary hover:bg-primaryHover"
                : "border shadow opacity-70 hover:opacity-85"
            } p-1 px-1.5 rounded-md transition text-xs inline-flex items-center gap-1`}
          >
            {isFollowing ? "UnFollow" : "Follow"}
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          </button>
        )}
      </div>
    </div>
  );
}
