"use client";
import React, { useEffect, useRef, useState } from "react";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import SubmitButton from "./SubmitButton";
import { getSetupDetails, setupAccount } from "../actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ViberDetailsInterface } from "@/server/controllers/viber";
import Link from "next/link";

type Props = {
  user: AuthUser;
};

export default function ViberSetup(props: Props) {
  const router = useRouter();
  const toastId = useRef<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const [isValid, setIsValid] = useState(false);
  const [viber, setViber] = useState<ViberDetailsInterface>();

  useEffect(() => {
    getSetupDetails<ViberDetailsInterface>(props.user.username)
      .then((viber) => setViber(viber))
      .catch((e) => console.log(e));
  }, [props.user]);

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setIsValid(e.currentTarget.checkValidity());
  };

  const handleSubmit = async () => {
    if (!formRef.current?.checkValidity()) {
      toast.dismiss(toastId.current);
      formRef.current?.reportValidity();
      toastId.current = toast.error("Please fill in all fields");
      return;
    }

    toast.dismiss(toastId.current);
    const formData = new FormData(formRef.current!);
    formData.append("userType", "viber");
    formData.append("genres", formData.getAll("genres")?.toString() || "");
    const response = await setupAccount(formData, location.pathname);

    if (response.success) {
      toastId.current = toast.success(response.message);
      router.push("/auth/setup?user=viber&avatar=0");
      return;
    }
    toastId.current = toast.error(response.message, { duration: 5_000 });
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      onChange={handleChange}
      className="grid sm:grid-cols-2 gap-4 items-center"
    >
      <div className="mb-4 space-y-1">
        <label htmlFor="bio" className="block opacity-90">
          Biography{" "}
          <span title="Required" className="font-bold text-orange-500 ml-1">
            *
          </span>
        </label>
        <TextareaField
          id="bio"
          name="bio"
          defaultValue={viber?.user.biography!}
          required
          minLength={25}
          placeholder="Tell us about yourself..."
        />
      </div>
      <div className="mb-4 space-y-1">
        <label htmlFor="genres" className="block opacity-90">
          Genres{" "}
          <span title="Required" className="font-bold text-orange-500 ml-1">
            *
          </span>
          <span className="hidden md:inline-block text-xs opacity-60 ml-2">
            (to select multiple press and hold the <b>ctrl</b> key)
          </span>
        </label>
        <select
          name="genres"
          defaultValue={viber?.genres?.split(",") || []}
          className="input max-h-[100px] flex flex-wrap w-full appearance-none p-2 space-y-0.5"
          id="genres"
          required
          multiple
        >
          {/* Strike the option if it"s selected */}
          {["pop", "jazz", "hip-hop", "metal", "country", "rock", "afro"].map(
            (genre) => (
              <option
                key={genre}
                value={genre}
                className="p-1 rounded-md w-full selection:decoration-dashed"
              >
                {genre}
              </option>
            )
          )}
        </select>
      </div>
      <div className="mb-4 space-y-1">
        <label htmlFor="youtube" className="block opacity-90">
          YouTube Profile
        </label>
        <InputField
          defaultValue={viber?.youtube!}
          type="url"
          id="youtube"
          name="youtube"
          placeholder="https://youtube.com/@your-username"
        />
      </div>
      <div className="mb-4 space-y-1">
        <label htmlFor="facebook" className="block opacity-90">
          Facebook Profile
        </label>
        <InputField
          defaultValue={viber?.facebook!}
          type="url"
          id="facebook"
          name="facebook"
          placeholder="https://facebook.com/your-username"
        />
      </div>
      <div className="mb-4 space-y-1">
        <label htmlFor="instagram" className="block opacity-90">
          Instagram Profile
        </label>
        <InputField
          defaultValue={viber?.instagram!}
          type="url"
          id="instagram"
          name="instagram"
          placeholder="https://instagram.com/your-username"
        />
      </div>
      <div className="h-max sm:self-end">
        <div
          className={`mb-4 grid items-center ${
            props.user.userType ? "sm:grid-cols-2 gap-4" : ""
          }`}
        >
          <SubmitButton
            disabled={!isValid}
            text={props.user.userType ? "Update Changes" : "Submit Changes"}
            pendingText={props.user.userType ? "Updating..." : "Submitting..."}
          />
          {props.user.userType && (
            <Link
              href={"/auth/setup?user=viber&avatar=0"}
              className="border inline-block w-full text-center shadow opacity-80 hover:opacity-100 transition-all p-2 rounded-md"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
