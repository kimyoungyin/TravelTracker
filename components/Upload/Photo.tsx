"use client";

import { ChangeEvent } from "react";

interface Props {
    currentTitle: string;
    toPrevStep: () => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    isLoading: boolean;
    currentPhotoCount: number;
}

export default ({
    currentTitle,
    toPrevStep,
    onChange,
    isLoading,
    currentPhotoCount,
}: Props) => {
    return (
        <div>
            <h2>{currentTitle}</h2>
            <button onClick={toPrevStep}>이전 단계</button>
            <label htmlFor="photos">
                {isLoading
                    ? "이미지 불러오는 중..."
                    : `사진 업로드하기(${
                          currentPhotoCount === 0
                              ? "최대 50개"
                              : `현재 ${currentPhotoCount}/50`
                      })`}
                <input
                    disabled={isLoading}
                    onChange={onChange}
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                />
            </label>
        </div>
    );
};
