import { sql } from "drizzle-orm";
import DB from "../db/connection";
import { users } from "../models/users";
import { viber } from "../models/viber";
import { supporter } from "../models/supporter";

export async function authenticate(data: LoginProps) {
  let query;
  if (data.usernameOnly) query = sql`username=${data.username}`;
  else
    query = sql`(phone=${data.phone || "None"} or username=${
      data.username || "None"
    }) and password=${data.password}`;

  const user = await DB.query.users.findFirst({
    // prettier-ignore
    where: query,
    columns: {
      name: true,
      avatar: true,
      username: true,
      phone: true,
      userType: true,
    },
  });
  return user;
}

// prettier-ignore
export async function createUser(data:any){
  
  const phoneExists = await DB.query.users.findFirst({where: sql`phone=${data.phone}`})
  if (phoneExists){
    return "This phone number was already registered"
  }
  const usernameExists = await DB.query.users.findFirst({where: sql`username=${data.username}`})
  if (usernameExists){
    return  "A user with this username already exists"
  }

  try {
    await DB.insert(users).values({
      name: data.name,
      phone: data.phone,
      username: data.username,
      password: data.password,
      avatar: data.avatar,
    })
    return 0
  } catch (error) {
    return "Failed to create user. Please try again"
  }
}

// prettier-ignore
export async function setupUserAccount(username:string, data:any){
  
  console.log("reached")
  const user = await DB.query.users.findFirst({where: sql`username=${username}`})
  console.log("reached2")

  if (!user){
    return "[Unauthorized] Failed to create user. Please try again"
  }

  if (data.userType === "viber"){
    try {
      const supporterExists = await DB.query.viber.findFirst({where: sql`user_id=${user.id}`})
      if (supporterExists){
        return "User profile already exists"
      }
      const promises = [
        DB.insert(supporter).values({
          userId: user.id,
          genres: data.genres,
        }),
        DB.update(users).set({
          avatar: data.avatar || null,
          biography: data.bio || "",
          userType: data.userType || "viber",
        }).where(sql`id=${user.id}`)
      ]
      await Promise.all(promises)
      return 0
    } catch (error) {
      return "Failed to create user. Please try again"
    }
  }
  else if (data.userType === "user"){
    try {
      const viberExists = await DB.query.viber.findFirst({where: sql`user_id=${user.id}`})
      if (viberExists){
        return "User profile already exists"
      }
      const promises = [
        DB.insert(viber).values({
          userId: user.id,
          genres: data.genres,
          category: "artists",
          facebook: data.facebook,
          instagram: data.instagram,
          youtube: data.youtube,
        }),
        DB.update(users).set({
          avatar: data.avatar || null,
          biography: data.bio || "",
          userType: data.userType || "viber",
        }).where(sql`id=${user.id}`)
      ]
      await Promise.all(promises)
      return 0
    } catch (error) {
      return "Failed to create user. Please try again"
    }
  }
  return `User type "${data.userType}" is not supported`

}

export async function updateUserAccount(username: any, data: UploadPayload) {
  try {
    const user = await DB.query.users.findFirst({
      where: sql`username=${username}`,
    });
    if (!user) return "[Unauthorized] Failed to update user. Please try again";
    const promises = [
      DB.update(users)
        .set(data)
        .where(sql`id=${user.id}`),
    ];
    await Promise.all(promises);
    return 0;
  } catch (error) {
    return "Failed to update user. Please try again";
  }
}

// prettier-ignore
export async function getUserDetails(username?:string, phone?:string, slug?:string){

  if (!username && !phone && !slug) return null

  let query

  if(username)
    query = sql`username=${username}`
  else if (phone) query = sql`phone=${phone}`
  else query = sql`slug=${slug}`

  const user = await DB.query.users.findFirst({
    where: query,
    columns: {
      id:false,
      password:false
    },
    with: true,
  })

  return user
}

type UploadPayload = typeof users.$inferInsert;

export type AuthUserInterface = Awaited<ReturnType<typeof authenticate>>;
export type UserDetailsInterface = Awaited<ReturnType<typeof getUserDetails>>;

type LoginProps = {
  phone?: string;
  username?: string;
  password: string;
  literal?: boolean;
} & { username: string; password?: string; usernameOnly: true };
