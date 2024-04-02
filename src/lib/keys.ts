export function onEnterKey(fn: () => void, e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
        fn();
    }
}