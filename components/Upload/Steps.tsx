"use client";

import Title from "./Title";
import { ChangeEvent, useState } from "react";
import Photo from "@/components/Upload/Photo";
import Meta from "@/components/Upload/Meta";
import ExifReader from "exifreader";
import convertExifDateToDateObj from "@/utils/metadata/convertExifDateToDateObj";
import convertExifGPSToFixedObj from "@/utils/metadata/convertExifGPSToFixedObj";
import imageCompression from "browser-image-compression";

type Step = "title" | "photo" | "meta";

interface Photo {
    file: File;
    description: string;
    time: Date | null;
    latitude: number | null;
    longtitude: number | null;
}
interface FormValues {
    title: string;
    photos: Photo[];
}

export default () => {
    const [formValues, setFormValues] = useState<FormValues>({
        title: "",
        photos: [],
    });
    const [step, setStep] = useState<Step>("title");

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.currentTarget.files) return;
        if (event.currentTarget.files.length > 50)
            return alert("사진은 최대 50개까지 업로드할 수 있습니다.");
        const photosPromise: Promise<Photo>[] = Array.from(
            event.currentTarget.files
        ).map(async (file) => {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 10,
                fileType: "image/png",
                preserveExif: true,
            });
            try {
                // 여기서 메타데이터 얻기: expanded true 설정 시 GPS 정보도 받아옴
                const tags = await ExifReader.load(compressedFile, {
                    expanded: true,
                });

                return {
                    file: compressedFile,
                    description: "",
                    time: convertExifDateToDateObj(tags.exif?.DateTime),
                    ...convertExifGPSToFixedObj(tags.gps),
                };
            } catch (error) {
                return {
                    file: compressedFile,
                    description: "",
                    time: null,
                    latitude: null,
                    longtitude: null,
                };
            }
        });
        const photos = (
            (await Promise.allSettled([...photosPromise])).filter(
                (obj) => obj.status === "fulfilled"
            ) as PromiseFulfilledResult<Photo>[]
        ).map((p) => p.value);
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

    console.log(formValues.photos);
    return <Meta />;
};
