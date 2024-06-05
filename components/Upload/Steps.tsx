"use client";

import Title from "./Title";
import { ChangeEvent, useState } from "react";
import Photo from "@/components/Upload/Photo";
import Meta from "@/components/Upload/Meta";

type Step = "title" | "photo" | "meta";

interface FormValues {
    title: string;
    photos: {
        file: File;
        description: string;
        time: Date | null;
        latitude: number | null;
        longtitude: number | null;
    }[];
}

export default () => {
    const [formValues, setFormValues] = useState<FormValues>({
        title: "",
        photos: [],
    });
    const [step, setStep] = useState<Step>("title");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.currentTarget.files) return;
        if (event.currentTarget.files.length > 50)
            return alert("사진은 최대 50개까지 업로드할 수 있습니다.");

        const photos = Array.from(event.currentTarget.files).map((file) => {
            // 여기서 메타데이터 얻기
            return {
                file,
                description: "",
                time: null,
                latitude: null,
                longtitude: null,
            };
        });
        setFormValues((prev) => ({ ...prev, photos }));
        if (photos.length > 0) setStep("meta");
    };

    if (step === "title")
        return (
            <Title
                toNextStep={() => setStep("photo")}
                value={formValues.title}
                onChange={(e) =>
                    setFormValues((prev) => ({
                        ...prev,
                        title: e.target.value,
                    }))
                }
            />
        );

    if (step === "photo")
        return (
            <Photo
                toPrevStep={() => setStep("title")}
                onChange={handleFileChange}
            />
        );

    return <Meta />;
};
