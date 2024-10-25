import { MediaLocation } from "./location/types";

export interface UriPlAllocationResult {
  addedTo: MediaLocation[];
  removedFrom: MediaLocation[];
  failedToChange: MediaLocation[];
}

export function getChanged(result: UriPlAllocationResult) {
  return [...result.addedTo, ...result.removedFrom];
}
