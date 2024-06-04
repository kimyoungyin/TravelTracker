import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import BigHeading from "@/components/BigHeading";

export default async function Index() {
    const canInitSupabaseClient = () => {
        // This function is just for the interactive tutorial.
        // Feel free to remove it once you have Supabase connected.
        try {
            createClient();
            return true;
        } catch (e) {
            return false;
        }
    };

    const isSupabaseConnected = canInitSupabaseClient();

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-4xl flex  justify-between items-center p-3 text-sm">
                    <span className="text-xl font-bold">TravelTracker</span>
                    {isSupabaseConnected && <AuthButton />}
                </div>
            </nav>
            <div className=" flex-1 flex flex-col justify-center items-stretch gap-16 text-center">
                <div className="animate-in flex gap-8 flex-col">
                    <BigHeading />
                    <p>사진으로 여행을 기록하세요</p>
                </div>
                <Link
                    href={"/login"}
                    className="rounded px-4 py-2 mx-2 mt-4  bg-amber-500 text-white hover:opacity-70 transition-opacity"
                >
                    시작하기
                </Link>
            </div>
            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <p>
                    Created by{" "}
                    <a
                        href="https://github.com/kimyoungyin"
                        target="_blank"
                        className="font-bold hover:underline"
                        rel="noreferrer"
                    >
                        Kimyoungyin
                    </a>
                </p>
            </footer>
        </div>
    );
}
