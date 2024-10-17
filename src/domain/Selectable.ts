export default interface Selectable {
  selected?: boolean;
}

export function toAllSelected<T extends Selectable>(objects: object[]): T[] {
  return objects.map((it) => toSelected(it));
}

export function toNoneSelected<T extends Selectable>(objects: object[]): T[] {
  return objects.map((it) => toNotSelected(it));
}

export function toSelected<T extends Selectable>(o: object): T {
  return { ...o, selected: true } as T;
}

export function toNotSelected<T extends Selectable>(o: object): T {
  return { ...o, selected: false } as T;
}

export function filterSelected<T extends Selectable>(selections: T[]) {
  return selections.filter((it) => it.selected);
}
