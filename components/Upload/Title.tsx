"use client";

import { ChangeEvent } from "react";

interface Props {
    toNextStep: () => void;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default ({ toNextStep, ...inputProps }: Props) => {
    return (
        <div>
            Title
            <input {...inputProps} />
            {inputProps.value.length > 0 && (
                <button onClick={toNextStep}>다음 단계</button>
            )}
        </div>
    );
};
