import { get, post, postVoid } from '../../lib/rest';

const FILES = '/audio-ui/db-api/config-file';

export interface FileNameAndContent {
  filename: string;
  content: string | null;
}

export function getFileNames(): Promise<string[]> {
  return get<string[]>(`${FILES}/names`).then(it => it.sort());
}

/**
 * Drawback: the double encoding approach assumes there's a web proxy in front of the Java app.
 */
export function getByFileName(filename: string): Promise<FileNameAndContent> {
  // const doubleEncoded = encodeURIComponent(encodeURIComponent(filename));
  // return get<FileNameAndContent>(`${FILES}/${doubleEncoded}`);
  return post<FileNameAndContent>(`${FILES}/query`, JSON.stringify({ filename }));
}

export function updateContent(nameAndContent: FileNameAndContent): Promise<void> {
  return postVoid(FILES, JSON.stringify(nameAndContent));
}
