import { sql } from "drizzle-orm";
import DB from "../db/connection";

// prettier-ignore
export async function getSupporterDetails  (supporterId?:string, userId?:string, username?:string,) {
    let query

    if (supporterId) query = sql`supporter_id=${supporterId}`
    else if (userId) query = sql`user_id=${userId}`
    else if (username) {
        const user = await DB.query.users.findFirst({ where: sql`username=${username}` })
        if (!user) return null
        query = sql`user_id=${user.id}`
    }
    else return null

    const supporter = await DB.query.supporter.findFirst({ 
        where: query,
        columns:{
           id:false,
           userId:false, 
        },
        with:{
            user:{
                columns:{
                    name:true,
                    username:true,
                    avatar:true,
                    biography:true,
                    phone:true,
                }
            }
        }
    })
    return supporter
}

export type SupporterDetailsInterface = Awaited<
  ReturnType<typeof getSupporterDetails>
>;
