"use client";
import React, { useEffect } from "react";
import AuthCard from "./AuthCard";
import InputField from "./InputField";
import { doLogin } from "../actions";
import toast from "react-hot-toast";
import { doRedirect } from "@/lib/actions";

export default function LoginForm() {
  const toastId = React.useRef<string>();

  // Clears the notification on page navigation
  useEffect(() => {
    return clearToastNotification;
  }, []);

  // Clear the previous toast notification
  const clearToastNotification = () => {
    toast.dismiss(toastId.current);
  };

  // Submit the login form
  async function submitForm(formData: FormData) {
    clearToastNotification();

    const response = await doLogin(formData, location.pathname);

    if (response.success) {
      // Display an error notification
      toastId.current = toast.success(response.message, {
        duration: 5000,
      });

      // revalidate the browser cache and redirect the user
      await doRedirect("/", "layout");
      return;
    }

    // Display an error notification
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
