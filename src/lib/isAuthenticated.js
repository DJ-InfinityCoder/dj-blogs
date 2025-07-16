import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function isAuthenticated(req) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { isAuthenticated: false, message: "Unauthorized access" };
    }
    return { isAuthenticated: true, user: session.user };
}
