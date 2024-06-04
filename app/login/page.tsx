import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import BigHeading from "@/components/BigHeading";

export default async function Login({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return redirect("/protected");
    }

    const googleLogin = async () => {
        "use server";
        const origin = headers().get("origin");
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }
        // oauth에선 필수
        if (data.url) {
            redirect(data.url);
        }
    };
    const kakaoLogin = async () => {
        "use server";

        const origin = headers().get("origin");
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        // oauth에선 필수
        if (data.url) {
            redirect(data.url);
        }
    };

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>{" "}
                Back
            </Link>
            <div className=" flex flex-col justify-between">
                <BigHeading />
                <p className="mt-10 mb-4 text-center font-semibold text-xl text-gray-400">
                    소셜 로그인으로 시작하기
                </p>
                <div className="mt-2 flex-1">
                    <form className="flex flex-col w-full justify-center items-center gap-2 text-foreground">
                        <SubmitButton
                            formAction={googleLogin}
                            className="border border-foreground/20 rounded-md w-80 mx-4 px-4 py-2 text-foreground mb-2"
                            pendingText="Signing Up..."
                        >
                            Start With Google
                        </SubmitButton>
                        <SubmitButton
                            formAction={kakaoLogin}
                            className="border border-foreground/20 rounded-md w-80 mx-4 px-4 py-2 text-foreground mb-2 bg-yellow-400"
                            pendingText="Signing Up..."
                        >
                            Start With Kakao
                        </SubmitButton>
                        {searchParams?.message && (
                            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                                {searchParams.message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
