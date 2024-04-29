"use client";
import { LucideIcon, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import SubmitButton from "./SubmitButton";

type Props = {
  title: string;
  description: React.ReactNode;
  pendingText?: string;
  buttonText: React.ReactNode;
  children: React.ReactNode;
  backIcon?: LucideIcon;
  showButton?: boolean;
  backIconTitle?: string;
  backButton?: () => void;
  formAction: (formData: FormData) => void;
};

export default function AuthCard({ showButton = true, ...props }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current!;

    const onChange = (event: any) => {
      const form = event.currentTarget as HTMLFormElement;
      const submitButton = form.querySelector("#submit") as HTMLButtonElement;

      if (form.checkValidity() && submitButton) {
        submitButton.disabled = false;
        return;
      }
      if (!submitButton) return;
      submitButton.disabled = true;
    };

    form.onchange = onChange;

    return () => {
      form.onchange = null;
    };
  }, []);

  const cancel = async () => {
    if (props.backButton) {
      props.backButton();
    } else {
      if (window.history.length > 0) {
        router.back();
        return;
      }
      router.push("/");
    }
  };

  return (
    <div className="card shadow rounded-md space-y-1">
      <div className="p-2 md:p-4 flex gap-6 lg:gap-12 items-center border-b justify-between">
        <div className="">
          <h1 className="text-2xl font-bold">{props.title}</h1>
          <p className="text-sm opacity-85">{props.description}</p>
        </div>
        <div className="">
          <button
            title={props.backIconTitle}
            className="hover:text-red-400/90 text-red-400 hover:scale-125 transition hover:shadow rounded-full"
            onClick={cancel}
          >
            {props.backIcon ? <>{props.backIcon}</> : <XCircle className="" />}
          </button>
        </div>
      </div>
      <form action={props.formAction} className="p-4 md:p-6" ref={formRef}>
        {props.children}
        {showButton && (
          <div className="mt-6 pt-2">
            <SubmitButton
              disabled={false}
              text={props.buttonText}
              pendingText={props.pendingText}
            />
          </div>
        )}
      </form>
    </div>
  );
}
