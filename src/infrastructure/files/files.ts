import { get, postVoid } from '../../lib/rest';

const FILES = '/audio-ui/api/files';

export interface RemoteFile {
  filename: string;
  content: string | null;
}

export function getRemoteFileNames(): Promise<string[]> {
  return get<string[]>(`${FILES}/names`);
}

export function getRemoteFile(): Promise<RemoteFile> {
  return get<RemoteFile>(FILES);
}

export function updateRemoteFile(remoteFile: RemoteFile): Promise<void> {
  return postVoid(FILES, JSON.stringify(remoteFile));
}
