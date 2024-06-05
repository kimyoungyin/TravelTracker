"use client";

import { ChangeEvent } from "react";

interface Props {
    toPrevStep: () => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default ({ toPrevStep, onChange }: Props) => {
    return (
        <div>
            <button onClick={toPrevStep}>이전 단계</button>
            <label htmlFor="photos">
                사진 업로드하기(최대 50)
                <input
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
