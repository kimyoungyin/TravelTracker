"use server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { User } from "@supabase/supabase-js";

const prisma = new PrismaClient();

export async function getUser() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;
    return await prisma.user.findUnique({
        where: { id: user.id },
    });
}

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
