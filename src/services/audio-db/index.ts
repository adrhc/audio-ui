import { postVoid } from '../rest';

const INDEX_MANAGER = '/audio-ui/db-api/index-manager';

export function reset() {
  return postVoid(`${INDEX_MANAGER}/reset`);
}

export function shallowDiskUpdate() {
  return postVoid(`${INDEX_MANAGER}/shallowDiskUpdate`);
}
