export default interface Selectable {
  selected?: boolean;
}

export function toSelected<T extends Selectable>(o: object): T {
  return { ...o, selected: true } as T;
}

export function filterSelected<T extends Selectable>(selections: T[]) {
  return selections.filter((it) => it.selected);
}
