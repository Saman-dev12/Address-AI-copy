import { db } from "@/db/drizzle";
import getSession from "./getSessions";
import { companyTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const [user] = await db
      .select()
      .from(companyTable)
      .where(eq(companyTable.email, session.user.email));

    if (!user) return null;
    console.log(user);
    

    return user;
  } catch (error) {
    return null;
  }
};

export default getCurrentUser;
