import React from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Link from "next/link";
import Setup from "../components/Setup";
import { getAuthenticatedUser } from "@/lib/auth";
import AvatarSetup from "../components/AvatarSetup";

export default async function Page(props: PageProps) {
  const route = (props.params.route || [])[0];
  const user = getAuthenticatedUser();

  if (route === "setup" && !props.searchParams.avatar)
    return <Setup user={user} searchParams={props.searchParams} />;

  if (route === "setup" && props.searchParams.avatar && user)
    return <AvatarSetup user={user} searchParams={props.searchParams} />;

  return (
    <div className="max-w-[500px] mx-auto mt-4">
      {route === "login" && <LoginForm />}
      {route === "register" && <RegisterForm />}
      {route === "setup" && (
        <Setup user={user} searchParams={props.searchParams} />
      )}
      {!validRoutes.includes(route) && (
        <div className="">
          <p className="text-sm text-red-500 text-center">Invalid route</p>
        </div>
      )}
      {validRoutes.slice(0, -1).includes(route) && (
        <div className="h-8 text-center mt-4 pt-2">
          <p className="text-sm">
            {route === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              href={route === "login" ? "/auth/register" : "/auth/login"}
              className="font-semibold transition ml-2 hover:text-sky-500 hover:underline underline-offset-4"
            >
              {route === "login" ? "Register" : "Login"}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

const validRoutes = ["register", "login", "setup"];
