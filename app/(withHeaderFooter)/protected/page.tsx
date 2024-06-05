import { getUser } from "@/app/data/auth";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { RedirectType, redirect } from "next/navigation";

export default async function ProtectedPage() {
    const user = await getUser();

    if (!user) {
        return redirect("/login", RedirectType.replace);
    }

    return (
        <div>
            {user.isAllowed
                ? "테스트 유저가 맞군요!"
                : "테스트 유저가 아니군요"}
        </div>
    );
}
