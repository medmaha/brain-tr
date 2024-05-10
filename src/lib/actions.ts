"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * A utility server-action that redirects user to the giving path
 * @param {string} path - The path to navigate to defaults to `/`
 * @param {RevalidateType} revalidate - Purge cached data on-demand for a specific path
 * @returns Promise - void
 */
// prettier-ignore
export async function doRedirect(path = "/",revalidate?:RevalidateType): Promise<void> {

  if (revalidate)
    revalidatePath(path, revalidate);
  return redirect(path);
}

type RevalidateType = "layout" | "page";
