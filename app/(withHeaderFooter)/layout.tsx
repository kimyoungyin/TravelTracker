import AuthButton from "../../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
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
                    <Link href="/" className="text-xl font-bold">
                        TravelTracker
                    </Link>
                    {isSupabaseConnected && <AuthButton />}
                </div>
            </nav>
            <div className=" flex-1 flex flex-col justify-center items-stretch gap-16 text-center">
                {children}
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
