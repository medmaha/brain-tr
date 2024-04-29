"use client";
import React from "react";
import AuthCard from "./AuthCard";
import InputField from "./InputField";
import { doLogin } from "../actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const toastId = React.useRef<string>();

  async function submitForm(formData: FormData) {
    toast.dismiss(toastId.current!);

    const response = await doLogin(formData, location.pathname);

    if (response.success) {
      toastId.current = toast.success(response.message, {
        duration: 5000,
      });
      router.replace("/");
      return;
    }

    toastId.current = toast.error(response.message, {
      duration: 10000,
    });
  }

  return (
    <AuthCard
      title="Login"
      formAction={submitForm}
      description="Sign in to your account"
      buttonText="Submit Login"
    >
      <div className="grid gap-4 space-y-2">
        <div className="grid">
          <label htmlFor="username" className="text-sm lg:text-base mb-2">
            Username / Phone
            <span className="font-bold text-sky-500 ml-2" title="required">
              *
            </span>
          </label>
          <InputField
            name="username"
            id="username"
            type="text"
            placeholder="Enter your username or phone"
          />
        </div>
        <div className="grid">
          <label htmlFor="password" className="text-sm mb-2 lg:text-base">
            Password{" "}
            <span className="font-bold text-sky-500 ml-2" title="required">
              *
            </span>
          </label>
          <InputField
            name="password"
            id="password"
            type="password"
            placeholder="Enter your phone or username"
          />
        </div>
      </div>
    </AuthCard>
  );
}
