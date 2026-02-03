import { post } from '../../lib/rest';

const DOWNLOAD = '/audio-ui/db-api/download';

export interface DownloadResponse {
  alreadyDownloaded: boolean;
  fileURI: string;
}

export function downloadTrack(urn: string): Promise<DownloadResponse> {
  return post<DownloadResponse>(DOWNLOAD, JSON.stringify({ urn }));
}

export function filterDownloaded(uris: string[]): Promise<string[]> {
  return post<string[]>(`${DOWNLOAD}/filter`, JSON.stringify({ uris }));
}
