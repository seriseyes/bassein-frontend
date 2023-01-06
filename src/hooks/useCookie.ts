import {useEffect, useState} from "react";

export default function useCookie(name: string) {
    const state = document.cookie;
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        state.split(";").forEach(el => {
            if (el.includes(name)) {
                setValue(el.split("=")[1]);
            }
        });
    }, [value, setValue]);

    return value;
}
