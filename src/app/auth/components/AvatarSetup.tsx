"use client";
import React, { useRef, useState } from "react";
import AuthCard from "./AuthCard";
import Image from "next/image";
import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadAvatar } from "../actions";
import toast from "react-hot-toast";

type Props = {
  user: AuthUser;
  searchParams: PageProps["searchParams"];
};

export default function AvatarSetup(props: Props) {
  const [showButton, setShowButton] = useState(false);
  const [avatar, setAvatar] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toastId = useRef<string>();

  let fullName = props.user.name.split(" ");

  const selectFile = () => inputRef.current?.click();

  const onchange = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setAvatar(file);
    setShowButton(true);
  };

  async function submit(formData: FormData) {
    toast.dismiss(toastId.current);
    const response = await uploadAvatar(formData, location.pathname);

    if (!response.success) {
      toastId.current = toast.error(response.message, { duration: 5_000 });
      return;
    }

    toastId.current = toast.success(response.message);
    router.replace("/");
  }

  return (
    <div className="max-w-[500px] mx-auto">
      <AuthCard
        title="Avatar Setup"
        description="Please upload your avatar"
        buttonText="Upload Avatar"
        showButton={showButton}
        formAction={submit}
        backButton={() => router.replace("/")}
      >
        <div className="flex justify-center pb-6 flex-col items-center gap-6">
          <div className="group relative w-[100px] h-[100px] rounded-full border">
            {avatar ? (
              <Image
                className="w-full h-full cursor-pointer hover:opacity-80 transition rounded-full post-author-img"
                alt="avatar"
                width={120}
                height={120}
                onClick={selectFile}
                src={URL.createObjectURL(avatar)}
              />
            ) : (
              <button
                type="button"
                onClick={selectFile}
                className="w-full relative transition h-full flex items-center justify-center text-xl bg-gray-600 hover:opacity-80 rounded-full"
              >
                {fullName[0].charAt(0) + fullName[1].charAt(0)}
              </button>
            )}
          </div>
          <input
            type="file"
            multiple={false}
            ref={inputRef}
            required
            name="avatar"
            onChange={onchange}
            className="w-full cursor-pointer input p-2 rounded-md file:border-none file:p-1 file:rounded-md"
          />
        </div>
      </AuthCard>
    </div>
  );
}
