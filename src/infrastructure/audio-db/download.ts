import { post } from '../../lib/rest';

const DOWNLOAD = '/audio-ui/db-api/download';

export interface DownloadResponse {
  alreadyDownloaded: boolean;
  filePath: string;
}

export function downloadTrack(uri: string): Promise<DownloadResponse> {
  return post<DownloadResponse>(DOWNLOAD, JSON.stringify({ uri }));
}
