"use client";
import { doSignOut } from "@/app/auth/actions";
import AuthCard from "@/app/auth/components/AuthCard";
import React from "react";
import { useRef } from "react";
import toast from "react-hot-toast";

type Props = {
  user: AuthUser;
  toggleLogout: (value: false) => void;
};

export default function Logout(props: Props) {
  const toastId = useRef<string>();

  const logout = async () => {
    toast.dismiss(toastId.current!);

    try {
      await doSignOut(location.pathname);
      toastId.current = toast.success("You've successfully logged out", {
        duration: 5_000,
      });
    } catch (error) {
      toastId.current = toast.error("Logout failed! Something went wrong", {
        duration: 5_000,
      });
    }
  };
  const cancel = async () => {
    props.toggleLogout(false);
  };

  return (
    <div className="z-20 backdrop-blur-sm bg-black/20 fixed top-0 left-0 flex items-center w-full h-full">
      <div className="min-w-[300px] mx-auto">
        <AuthCard
          formAction={logout}
          backButton={cancel}
          buttonText="Sign Out"
          title="Logout"
          description="Are you sure you want to logout?"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm opacity-90 max-w-[50ch] text-start">
              This will securely clear your session and protect your account.
            </p>
            <p className="text-sm opacity-80 max-w-[48ch] text-start">
              You can always log back in using your credentials whenever you
              want to access your account again.
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
