import { PrismaClient } from "@prisma/client";
import { User } from "@supabase/supabase-js";

const prisma = new PrismaClient();

export async function postUser(user: User) {
    const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
    });
    if (!currentUser) {
        await prisma.user.create({
            data: {
                id: user.id,
                username: user.user_metadata.full_name,
                email: user.user_metadata.email,
            },
        });
    }
}
