"use client";
import React from "react";
import AuthCard from "./AuthCard";
import InputField from "./InputField";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { doRegister } from "../actions";

export default function RegisterForm() {
  const router = useRouter();
  const toastId = React.useRef<string>();

  async function submitForm(formData: FormData) {
    toast.dismiss(toastId.current!);

    const response = await doRegister(formData, location.pathname);
    if (response.success) {
      toastId.current = toast.success(response.message, { duration: 5_000 });
      router.replace("/auth/setup");
      return;
    }

    toastId.current = toast.error(response.message, { duration: 5_000 });
  }

  return (
    <AuthCard
      title="Register"
      formAction={submitForm}
      pendingText={"Registering..."}
      description={
        <>
          Register an account with <b className="text-primary">Viby</b>
        </>
      }
      buttonText="Register Account"
    >
      <div className="grid gap-4 space-y-2 pb-4">
        <p className="text-center max-w-[50ch] mx-auto">
          👋 Signing up is quick and easy! Just provide a few details to create
          your account.
        </p>

        <div className="grid">
          <label htmlFor="name" className="text-sm lg:text-base mb-2">
            Full Name
            <span className="font-bold text-warning ml-2" title="Required">
              *
            </span>
          </label>
          <InputField
            name="name"
            id="name"
            type="text"
            required
            placeholder="Enter your full name"
          />
        </div>
        <div className="grid">
          <label htmlFor="username" className="text-sm lg:text-base mb-2">
            Username
            <span className="font-bold text-warning ml-2" title="Required">
              *
            </span>
          </label>
          <InputField
            name="username"
            id="username"
            type="text"
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="grid">
          <label htmlFor="phone" className="text-sm lg:text-base mb-2">
            Phone
            <span className="font-bold text-warning ml-2" title="Required">
              *
            </span>
          </label>
          <InputField
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="grid">
          <label htmlFor="password" className="text-sm mb-2 lg:text-base">
            Password{" "}
            <span className="font-bold text-warning ml-2" title="Required">
              *
            </span>
          </label>
          <InputField
            name="password"
            id="password"
            required
            type="password"
            placeholder="Enter your phone or username"
          />
        </div>
      </div>
    </AuthCard>
  );
}
