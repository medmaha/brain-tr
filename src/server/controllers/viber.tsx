import { sql } from "drizzle-orm";
import DB from "../db/connection";

// prettier-ignore
export async function getViberDetails  (viberId?:string, userId?:string, username?:string,) {
    let query

    if (viberId) query = sql`viber_id=${viberId}`
    else if (userId) query = sql`user_id=${userId}`
    else if (username) {
        const user = await DB.query.users.findFirst({ where: sql`username=${username}` })
        if (!user) return null
        query = sql`user_id=${user.id}`
    }
    else return null

    const viber = await DB.query.viber.findFirst({ 
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
    return viber
}

export type ViberDetailsInterface = Awaited<ReturnType<typeof getViberDetails>>;
