"use server";

import { getAuthenticatedUser } from "@/lib/auth";
import { uploadFile } from "@/lib/firebase/uploader";
import {
  CommentListInterface,
  getPostComments,
} from "@/server/controllers/comments";
import DB from "@/server/db/connection";
import {
  CommentInterface,
  comments,
  replies,
  ReplyInterface,
} from "@/server/models/comments";
import { posts } from "@/server/models/posts";
import { sql } from "drizzle-orm";

// prettier-ignore
export async function makeComment(formData: FormData): Promise<ActionReturn<CommentInterface>> {
    const auth =  getAuthenticatedUser();
    if (!auth) {
      return {
        success: false,
        message: "[Unauthorized] Invalid user",
      };
    }
    const postSlug = formData.get("post_slug")?.toString();
    const commentType = formData.get("comment_type")?.toString() as any;

    if (!commentType || !postSlug) {
        return {
            success: false,
            message: "Invalid comment",
        };
    }

    const text = formData.get("text")?.toString();
    const file = formData.get("file") as File | undefined;

    let fileUrl: string | undefined
    if (file) {
      fileUrl = await uploadFile(file, "comment");
      if (!fileUrl) 
        return {
            success: false,
            message: "Error uploading file",
        }
    }   

    const user = (await DB.query.users.findFirst({ where: sql`username=${auth.username}`}))!
    const [rows] = await Promise.all([
      DB.insert(comments,).values({
        text,
        fileUrl,
        postSlug,
        commentType,
        authorId: user.id,
      }).returning(),
      DB.update(posts).set({commentsCount: sql`comments_count + 1`}).where(sql`slug=${postSlug}`)
    ])


    return {
        success:true,
        data: rows[0],
        message:"Comment created successfully",
    }

}

// prettier-ignore
export async function makeCommentReply(formData: FormData): Promise<ActionReturn<ReplyInterface>> {
  const auth =  getAuthenticatedUser();
    if (!auth) {
      return {
        success: false,
        message: "[Unauthorized] Invalid user",
      };
    }
    const postSlug = formData.get("post_slug")?.toString();
    const commentType = formData.get("comment_type")?.toString() as any;
    const parentId = Number(formData.get("parent_id")?.toString());

    if (!commentType || !postSlug || !parentId) {
        return {
            success: false,
            message: "Invalid comment",
        };
    }

    const text = formData.get("text")?.toString();
    const file = formData.get("file") as File | undefined;

    let fileUrl: string | undefined
    if (file) {
      fileUrl = await uploadFile(file, "comment");
      if (!fileUrl) 
        return {
            success: false,
            message: "Error uploading file",
        }
    }   

    const user = (await DB.query.users.findFirst({ where: sql`username=${auth.username}`}))!
    const [rows] = await Promise.all([
      DB.insert(replies,).values({
        text,
        fileUrl,
        postSlug,
        parentId,
        commentType,
        authorId: user.id,
      }).returning(),
      DB.update(posts).set({commentsCount: sql`comments_count + 1`}).where(sql`slug=${postSlug}`)
    ])


    return {
        success:true,
        data: rows[0],
        message:"Comment created successfully",
    }
}

// prettier-ignore
export async function getComments(slug: string) :Promise<ActionReturn<CommentListInterface>>{
    const comments = await getPostComments(slug)
    return {
        success:true,
        data: comments,
        message:"Comments retrieved successfully",
    }
}
