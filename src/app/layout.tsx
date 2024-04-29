import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FloatingButton from "@/app/components/FloatingButton";
import { Suspense } from "react";
import PageLoader from "@/app/components/PageLoader";
import GlobalContextProvider from "./contexts/global";
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const appName = "Viby ";
const publisher = "Intra Software";

export const metadata: Metadata = {
  title: `${appName} | Entertainment Platform`,
  description: `${appName} is an entertainment platform`,
  keywords: [
    appName,
    "Entertainment",
    "Platform",
    "musics",
    "videos",
    "photos",
    "chat",
    "audio",
  ],
};

export default function RootLayout({ children }: any) {
  const user = getAuthenticatedUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className}`}>
        <noscript>
          <p className="pt-6 text-xl text-red-600">
            You need to enable JavaScript to run this app.
          </p>
        </noscript>

        <GlobalContextProvider user={user}>
          <Navbar appName={appName} user={user} />
          <Main user={user}>{children}</Main>
          <Footer appName={appName} publisher={publisher} />
        </GlobalContextProvider>
      </body>
    </html>
  );
}

function Main({ children, user }: any) {
  return (
    <main className="p-1 mt-2 min-h-[82svh] md:min-h-[75svh]">
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
      <FloatingButton user={user} />
    </main>
  );
}
