"use client";
import { doSignOut } from "@/app/auth/actions";
import AuthCard from "@/app/auth/components/AuthCard";
import { useRouter } from "next/navigation";
import React from "react";
import { useRef } from "react";
import toast from "react-hot-toast";

type Props = {
  user: AuthUser;
  toggleLogout: (value: false) => void;
};

export default function Logout(props: Props) {
  const router = useRouter();
  const toastId = useRef<string>();

  const logout = async () => {
    toast.dismiss(toastId.current!);

    const response = await doSignOut(location.pathname);
    if (response.success) {
      toastId.current = toast.success(response.message, { duration: 5_000 });
      router.replace("/");
      cancel();
      return;
    }
    toastId.current = toast.error(response.message, { duration: 5_000 });
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
