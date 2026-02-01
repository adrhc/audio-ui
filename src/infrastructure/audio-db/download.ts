import { post } from '../../lib/rest';

const DOWNLOAD = '/audio-ui/db-api/download';

export interface DownloadResponse {
  alreadyDownloaded: boolean;
}

export function downloadTrack(uri: string): Promise<DownloadResponse> {
  return post<DownloadResponse>(DOWNLOAD, JSON.stringify({ uri }));
}
