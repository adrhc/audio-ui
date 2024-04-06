export function fillWithLastElem<T>(arr: T[], length: number) {
  const last = arr[arr.length - 1];
  const newArr = [...arr];
  for (let i = arr.length; i < length; i++) {
    newArr.push(last);
  }
  return newArr;
}

export function valueAtIndexOrLast<T>(arr: T[], index: number): T {
  return arr.length <= index ? arr[arr.length - 1] : arr[index];
}

export function toArray<T>(t: T) {
  return Array.isArray(t) ? t : [t];
}
