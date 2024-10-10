export default interface Selectable {
  selected?: boolean;
}

export function filterSelected<T extends Selectable>(selections: T[]) {
  return selections.filter((it) => it.selected);
}
