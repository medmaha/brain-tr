"use server";
import { getAuthenticatedUser } from "@/lib/auth";
// import { getVideoMetadata } from "get-video-metadata";

import { deleteUploadedFile, uploadFile } from "@/lib/firebase/uploader";
import DB from "@/server/db/connection";
import { posts } from "@/server/models/posts";
import { sql } from "drizzle-orm";

export async function getVideoData(data: FormData) {
  // const metadata = await getVideoMetadata(
  // URL.createObjectURL(data.get("file") as File)
  // );
  // console.log(metadata);
  return {};
}

export async function createPost(formData: FormData) {
  const author = getAuthenticatedUser();

  if (!author) {
    return {
      success: false,
      message: "You must be logged in to create a post",
    };
  }
  const fileType = formData.get("file_type")?.toString() as FileType;

  if (!fileType) {
    return {
      success: false,
      message: "Invalid filetype to upload",
    };
  }

  const file = formData.get("file") as File;
  let fileUrl = formData.get("file_url")?.toString();

  if (!file && !fileUrl) {
    return {
      success: false,
      message: "Invalid file to upload",
    };
  }

  if (!fileUrl && file) fileUrl = await uploadFile(file, fileType);

  if (!fileUrl) {
    return {
      success: false,
      message: `Failed to upload ${fileType}, try again later!`,
    };
  }

  let thumbnailUrl: string | undefined;
  const thumbnail = formData.get("thumbnail") as File;

  if (thumbnail) {
    thumbnailUrl = await uploadFile(thumbnail, "image");
    if (!thumbnailUrl) {
      const deleted_1 = await deleteUploadedFile(fileUrl);
      let message = "Failed upload thumbnail, try again later!";
      if (!deleted_1) {
        message = "Failed upload thumbnail && unable to backtrack.";
      }
      return {
        message,
        success: false,
      };
    }
  }

  try {
    const user = await DB.query.users.findFirst({
      where: sql`username=${author.username}`,
    });
    if (!user) {
      const deleted_1 = await deleteUploadedFile(fileUrl);
      let message = "Unauthorized user, login and try again.";
      if (thumbnailUrl && deleted_1) {
        const deleted_2 = await deleteUploadedFile(thumbnailUrl);
        if (!deleted_2) {
          message = "Unauthorized user && unable to backtrack thumbnail.";
        }
      } else if (!deleted_1) {
        message = "Unauthorized user && unable to backtrack video";
      }
      return {
        message,
        success: false,
      };
    }
    const rows = await DB.insert(posts)
      .values({
        fileUrl,
        fileType,
        thumbnailUrl,
        authorId: user.id,
        mediaName: formData.get("media_name") as string,
        caption: formData.get("caption") as string,
        hashtags: formData.get("hashtags") as string,
      })
      .returning();

    const slug = rows[0]?.slug;
    return {
      slug,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
