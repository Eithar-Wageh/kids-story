import  { db }from '../../../config/db';
import {usersTable} from "../../../config/schema"
import {NextResponse  } from "next/server";
import { eq } from "drizzle-orm";
export async function   POST(req) {
 const { email, name } = await req.json()
//if user exist

const user = await db.select().from(usersTable).where(eq(usersTable.email),email)

//if user not exist

if (user?.length==0) {
   const result = await db.insert(usersTable).values({
    name: name,
    email: email
}).onConflictDoNothing().returning();
    console.log(result);
    
    return NextResponse.json(result)
}
return NextResponse.json(user[0])
}