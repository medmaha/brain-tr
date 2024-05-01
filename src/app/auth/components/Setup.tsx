import { HandHeartIcon, Info, Music, NfcIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import BackButton from "./BackButton";
import ViberSetup from "./ViberSetup";
import SupporterSetup from "./SupporterSetup";

type Props = {
  user: AuthUser | null;
  searchParams: PageProps["searchParams"];
};

export default function Setup(props: Props) {
  if (!props.user) return <div>Error!</div>;

  return (
    <div
      className={`${
        !props.searchParams.user ? "max-w-[700px] mt-8" : "max-w-[1000px]"
      } card p-6 mx-auto rounded-md shadow`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="">
          <h3 className="text-xl font-semibold">
            {!props.searchParams.user && "Hi,"} {props.user.name}
          </h3>
          <p className="text-sm opacity-80">
            {!props.searchParams.user &&
              "In this module, we'll help you setup your account"}
          </p>
        </div>
        {!!props.searchParams.user && !props.user.userType && (
          <div className="">
            <p className="sm:text-lg lg:text-xl font-semibold capitalize opacity-80">
              {props.searchParams.user}
            </p>
          </div>
        )}
        {!!props.searchParams.user && !props.user.userType && <BackButton />}

        {!props.searchParams.user && (
          <h3 className="text-xl font-bold hidden sm:inline-block">
            Account Setup
          </h3>
        )}
      </div>

      <div className="border-t mt-4 pt-2">
        {!props.searchParams.user && (
          <div className="flex flex-wrap gap-4 pt-6">
            <Link href="/auth/setup?user=viber" className="flex-1 w-full">
              <button className="p-2 group w-full inline-flex items-center gap-2 justify-center text-lg rounded sm:p-4 sm:rounded-md flex-1 bg-primary hover:bg-primaryHover">
                I am an Artist{" "}
                <Music
                  size={24}
                  className="text-orange-500 group-hover:text-orange-500/90"
                />
              </button>
            </Link>
            <Link href={"/auth/setup?user=supporter"} className="flex-1 w-full">
              <button className="p-2  group inline-flex w-full items-center gap-2 justify-center text-lg rounded sm:p-4 sm:rounded-md flex-1 bg-orange-500 hover:bg-orange-500/90">
                I am a Supporter{" "}
                <HandHeartIcon
                  size={24}
                  className="text-primary group-hover:text-primaryHover"
                />
              </button>
            </Link>
          </div>
        )}
        {props.searchParams.user === "viber" && (
          <>
            <div className="my-4 pb-4 w-full">
              {!props.searchParams.avatar && (
                <p className="text-center w-full opacity-90 pb-6 border-b md:w-max mx-auto px-4">
                  <Info className="inline text-primary mr-2" /> Please fill in
                  the following information to complete your account setup
                </p>
              )}
            </div>
            <ViberSetup user={props.user} />
          </>
        )}
        {props.searchParams.user === "supporter" && (
          <>
            <div className="my-4 pb-4 w-full">
              {!props.searchParams.avatar && (
                <p className="text-center w-full opacity-90 pb-6 border-b md:w-max mx-auto px-4">
                  <Info className="inline text-primary mr-2" /> Please fill in
                  the following information to complete your account setup
                </p>
              )}
            </div>
            <SupporterSetup user={props.user} />
          </>
        )}
      </div>
    </div>
  );
}
