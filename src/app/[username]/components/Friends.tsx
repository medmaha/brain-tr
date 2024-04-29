import React from "react";

export default function Friends() {
  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
          Friends
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                JD
              </span>
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">Jane Doe</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                BS
              </span>
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bob Smith
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                SJ
              </span>
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sarah Jones
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                MB
              </span>
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mike Brown
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                EW
              </span>
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Emily Wilson
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                DL
              </span>
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              David Lee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
