import AuthButton from "../../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import BigHeading from "@/components/BigHeading";
import { getUser } from "@/app/data/auth";
import { RedirectType, redirect } from "next/navigation";

export default async function Page() {
    const user = await getUser();

    return (
        <>
            <div className="animate-in flex gap-8 flex-col">
                <BigHeading />
                <p>사진으로 여행을 기록하세요</p>
            </div>
            <Link
                href={user ? "/upload" : "/login"}
                className="rounded px-4 py-2 mx-2 mt-4  bg-amber-500 text-white hover:opacity-70 transition-opacity"
            >
                시작하기
            </Link>
        </>
    );
}
