export function onEnterKey(fn: () => void, e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    // console.log(e);
    if (e.key === "Enter") {
        fn();
    }
}