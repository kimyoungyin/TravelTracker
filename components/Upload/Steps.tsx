"use client";

import Title from "./Title";
import { ChangeEvent, useEffect, useState } from "react";
import Photo from "@/components/Upload/Photo";
import Meta from "@/components/Upload/Meta";
import ExifReader from "exifreader";
import convertExifDateToDateObj from "@/utils/metadata/convertExifDateToDateObj";
import convertExifGPSToFixedObj from "@/utils/metadata/convertExifGPSToFixedObj";
import imageCompression from "browser-image-compression";

type Step = "title" | "photo" | "meta";

export interface PhotoWithExif {
    file: File;
    previewUrl: string;
    description: string;
    time: Date | null;
    latitude: number | null;
    longtitude: number | null;
}

interface FormValues {
    title: string;
    photosWithExif: PhotoWithExif[];
    photosWithoutExif: PhotoWithExif[];
}

export default () => {
    const [formValues, setFormValues] = useState<FormValues>({
        title: "",
        photosWithExif: [],
        photosWithoutExif: [],
    });
    const [step, setStep] = useState<Step>("title");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        return () => {
            formValues.photosWithExif.forEach((photo) =>
                URL.revokeObjectURL(photo.previewUrl)
            );
            formValues.photosWithoutExif.forEach((photo) =>
                URL.revokeObjectURL(photo.previewUrl)
            );
        };
    }, []);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.currentTarget.files) return;
        if (
            event.currentTarget.files.length +
                formValues.photosWithExif.length +
                formValues.photosWithoutExif.length >
            50
        )
            return alert("사진은 최대 50개까지 업로드할 수 있습니다.");
        setIsLoading(true);
        const photosPromise: Promise<PhotoWithExif>[] = Array.from(
            event.currentTarget.files
        ).map(async (file) => {
            try {
                // 압축 시 데이터 형식 소실되서 이후 처리
                // 여기서 메타데이터 얻기: expanded true 설정 시 GPS 정보도 받아옴
                const tags = await ExifReader.load(file, {
                    expanded: true,
                });
                return {
                    file,
                    previewUrl: URL.createObjectURL(file),
                    description: "",
                    time: convertExifDateToDateObj(tags.exif?.DateTime),
                    ...convertExifGPSToFixedObj(tags.gps),
                };
            } catch (error) {
                console.log("파일 형식을 지원하지 않음");
                return {
                    file,
                    previewUrl: URL.createObjectURL(file),
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
            ) as PromiseFulfilledResult<PhotoWithExif>[]
        ).map((p) => p.value);
        const photosWithoutExif = [
            ...formValues.photosWithoutExif,
            ...photos.filter(
                (photo) => !photo.latitude || !photo.longtitude || !photo.time
            ),
        ];
        const sortedPhotosWithExif = [
            ...formValues.photosWithExif,
            ...photos.filter(
                (photo) => photo.latitude && photo.longtitude && photo.time
            ),
        ].sort((a, b) => a.time!.getTime() - b.time!.getTime());
        setIsLoading(false);
        setFormValues((prev) => ({
            ...prev,
            photosWithExif: sortedPhotosWithExif,
            photosWithoutExif,
        }));
        if (photos.length > 0) setStep("meta");
    };

    const handleInsertMetadata = (
        idx: number,
        metaValues: { date: Date; lat: number; lng: number }
    ) => {
        setFormValues((prev) => {
            const newWithExif = [...prev.photosWithExif];
            newWithExif.push({
                ...prev.photosWithoutExif[idx],
                latitude: metaValues.lat,
                longtitude: metaValues.lng,
                time: metaValues.date,
            });
            const newWithoutExif = prev.photosWithoutExif.slice(idx, 1);
            return {
                photosWithExif: newWithExif,
                photosWithoutExif: newWithoutExif,
                title: prev.title,
            };
        });
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
                currentTitle={formValues.title}
                currentPhotoCount={
                    formValues.photosWithExif.length +
                    formValues.photosWithoutExif.length
                }
                toPrevStep={() => setStep("title")}
                onChange={handleFileChange}
                isLoading={isLoading}
            />
        );

    return (
        <Meta
            photosWithoutExif={formValues.photosWithoutExif}
            photosWithExif={formValues.photosWithExif}
            toPrevStep={() => setStep("photo")}
            onSubmit={handleInsertMetadata}
        />
    );
};
