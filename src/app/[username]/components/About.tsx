import { UserDetailsInterface } from "@/server/controllers/users";
import { format } from "date-fns";
import React from "react";

type Props = {
  profile: UserDetailsInterface;
};

export default function About({ profile }: Props) {
  return (
    <div
      className="my-8 mx-auto space-y-6 max-w-[800px] p-7 rounded-lg card shadow-sm"
      data-v0-t="card"
    >
      <div className="grid gap-4 md:gap-6 sm:grid-cols-[100px,1fr]">
        <p className="font-semibold">Bio</p>
        <p className="text-sm max-w-[65ch] opacity-90">
          {profile?.biography || "N/A"}
        </p>
      </div>
      <div className="grid gap-4 md:gap-6 sm:grid-cols-[100px,1fr] items-center">
        <p className="font-semibold">Location</p>
        <p className="text-sm opacity-90">Latrikunda Sabiji | The Gambia</p>
      </div>
      <div className="grid gap-4 md:gap-6 sm:grid-cols-[100px,1fr] items-center">
        <p className="font-semibold">Date Joined</p>
        <p className="opacity-70 text-sm">
          {format(profile!.createdAt, "PPPPP")}
        </p>
      </div>
    </div>
  );
}
// export default function About() {
//   return (
//     <div
//       className="rounded-lg border bg-card text-card-foreground shadow-sm"
//       data-v0-t="card"
//     >
//       <div className="flex flex-col space-y-1.5 p-6">
//         <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
//           About
//         </h3>
//       </div>
//       <div className="p-6">
//         <p className="text-gray-600 dark:text-gray-400">
//           I&apos;m a passionate social media enthusiast who loves connecting
//           with people from all walks of life. In my free time, you can find me
//           exploring new restaurants, hiking in the great outdoors, or curled up
//           with a good book.
//         </p>
//       </div>
//     </div>
//   );
// }
