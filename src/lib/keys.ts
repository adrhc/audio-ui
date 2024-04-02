export function onNumberEnterKey(fn: (value: number) => void, e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
        fn(+e.target.value);
    }
}

export function onEnterKey(fn: () => void, e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
        fn();
    }
}