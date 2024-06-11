"use client";

import PinMovableMap from "@/components/Upload/PinMovableMap";
import { PhotoWithExif } from "@/components/Upload/Steps";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";

export default ({
    photosWithExif,
    photosWithoutExif,
    toPrevStep,
}: {
    photosWithExif: PhotoWithExif[];
    photosWithoutExif: PhotoWithExif[];
    toPrevStep: () => void;
}) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [prevPhotoIndex, setPrevPhotoIndex] = useState<number | null>(null);
    const [metaValues, setMetaValues] = useState<{
        gapMin: number;
        lat: number;
        lng: number;
    }>({ gapMin: 0, lat: 0, lng: 0 });
    const [searchValue, setSearchValue] = useState("");
    const [isLocationSearching, setIsLocationSearching] = useState(false);
    console.log(metaValues.lat, metaValues.lng);
    if (editingIndex !== null) {
        if (isLocationSearching && prevPhotoIndex !== null) {
            return (
                <>
                    <h3>사진 위치 고르기</h3>
                    <button onClick={() => setEditingIndex(null)}>취소</button>
                    <div className="flex">
                        <img
                            src={photosWithoutExif[editingIndex].previewUrl}
                            className="flex-1 max-w-[50%] aspect-square object-cover"
                        />
                        <div className="flex-1">
                            <h2>어디서 사진을 찍으셨나요?</h2>
                            <span>이전 사진 위치는 띄워놓았어요</span>
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <button>검색</button>
                            {/* 지도 위치 */}
                            <APIProvider
                                apiKey={
                                    process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!
                                }
                            >
                                <PinMovableMap
                                    prevPhotoObj={
                                        photosWithExif[prevPhotoIndex]
                                    }
                                    currPhotoObj={
                                        photosWithoutExif[editingIndex]
                                    }
                                    currPhotoPosition={metaValues}
                                    onChangeCurrPhotoPosition={(ev) =>
                                        setMetaValues((prev) => {
                                            if (
                                                !ev.detail.latLng?.lat ||
                                                !ev.detail.latLng.lng
                                            )
                                                return prev;

                                            return {
                                                ...prev,
                                                lat: Number(
                                                    ev.detail.latLng.lat.toFixed(
                                                        6
                                                    )
                                                ),
                                                lng: Number(
                                                    ev.detail.latLng.lng.toFixed(
                                                        6
                                                    )
                                                ),
                                            };
                                        })
                                    }
                                    onDragCurrPhotoPosition={(ev) => {
                                        setMetaValues((prev) => {
                                            if (
                                                !ev.latLng?.lat ||
                                                !ev.latLng.lng
                                            )
                                                return prev;
                                            return {
                                                ...prev,
                                                lat: Number(
                                                    ev.latLng.lat().toFixed(6)
                                                ),
                                                lng: Number(
                                                    ev.latLng.lng().toFixed(6)
                                                ),
                                            };
                                        });
                                    }}
                                />
                            </APIProvider>
                        </div>
                    </div>
                    {metaValues.lat !== 0 && metaValues.lng !== 0 && (
                        <button onClick={() => setIsLocationSearching(false)}>
                            결정
                        </button>
                    )}
                </>
            );
        } else {
            return (
                <div className="flex flex-col">
                    <h3>사진이 촬영된 시간 고르기</h3>
                    <img
                        src={photosWithoutExif[editingIndex].previewUrl}
                        className="flex-1 max-w-[50%] aspect-square object-cover"
                    />
                    {prevPhotoIndex === null ? (
                        <>
                            <span>
                                이 사진은 아래 사진 중 어떤 사진 이후에
                                촬영했나요?
                            </span>
                            <div className="grid gap-4 grid-cols-3 md:grid-cols-4">
                                {photosWithExif.length === 0 ? (
                                    <>
                                        <span>
                                            시간 기준이 되어야 할 사진이
                                            없습니다. 다른 사진을 먼저
                                            추가해주세요
                                        </span>
                                        <button onClick={toPrevStep}>
                                            사진 더 추가하기
                                        </button>
                                    </>
                                ) : (
                                    photosWithExif.map((obj, index) => (
                                        <img
                                            onClick={() =>
                                                setPrevPhotoIndex(index)
                                            }
                                            key={obj.previewUrl}
                                            src={obj.previewUrl}
                                            className="aspect-square object-cover border rounded cursor-pointer"
                                        />
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div>
                            <span>얼마나 이후에 촬영했나요?</span>
                            <input
                                type="number"
                                min={0}
                                value={metaValues.gapMin}
                                onChange={(e) =>
                                    setMetaValues({
                                        gapMin: Number(e.target.value),
                                        lat: 0,
                                        lng: 0,
                                    })
                                }
                            />{" "}
                            분
                            {metaValues.gapMin > 0 && (
                                <button
                                    onClick={() => setIsLocationSearching(true)}
                                >
                                    장소 고르기
                                </button>
                            )}
                        </div>
                    )}
                </div>
            );
        }
    }

    return (
        <div>
            <button onClick={toPrevStep}>이전 단계</button>
            <h2>메타 데이터 있음</h2>
            <div className="grid gap-4 grid-cols-3 md:grid-cols-4">
                {photosWithExif.map((obj) => (
                    <img
                        key={obj.previewUrl}
                        src={obj.previewUrl}
                        className="aspect-square object-cover border rounded"
                    />
                ))}
            </div>
            <h2>메타 데이터 없음</h2>
            <div className="grid gap-4 grid-cols-3 md:grid-cols-4">
                {photosWithoutExif.map((obj, index) => (
                    <img
                        onClick={() => setEditingIndex(index)}
                        key={obj.previewUrl}
                        src={obj.previewUrl}
                        className="aspect-square object-cover border rounded border-5 border-red-600 cursor-pointer opacity-50"
                    />
                ))}
            </div>
        </div>
    );
};
