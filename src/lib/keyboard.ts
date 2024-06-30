export function onEnterKey(fn: () => void, e: React.KeyboardEvent<HTMLDivElement| HTMLTextAreaElement | HTMLInputElement>) {
    // console.log(e);
    if (e.key === "Enter") {
        fn();
    }
}