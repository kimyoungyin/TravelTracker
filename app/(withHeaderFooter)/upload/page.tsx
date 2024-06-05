import { getUser } from "@/app/data/auth";
import BigHeading from "@/components/BigHeading";
import Steps from "@/components/Upload/Steps";
import Link from "next/link";

export default async function Page() {
    const user = await getUser();

    if (!user)
        return (
            <>
                <BigHeading />
                <div>여행을 기록하고 싶다면 로그인하세요</div>
                <button>
                    <Link href={"/login"}>로그인하기</Link>
                </button>
            </>
        );

    if (!user.isAllowed)
        return (
            <>
                <BigHeading />
                <h2>승인 대기 중입니다</h2>
                <span>아직 베타테스터로 등록되지 않았어요...</span>
            </>
        );

    return (
        <>
            <Steps />
        </>
    );
}
