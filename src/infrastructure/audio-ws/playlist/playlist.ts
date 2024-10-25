import { get } from '../../../lib/rest';
import { SelectableSong, Song } from '../../../domain/song';
import { RefWithImages, refWithImagesToSongs } from './types';
import { toSelected } from '../../../domain/Selectable';
import { sortMediaLocationsIfNotFromLocalPl } from '../../../domain/media-location';

const MOPIDY_PLAYLIST = '/audio-ui/api/mopidy-playlist';

/**
 * Get the playlist content using/from audio-web-services (which uses Mopidy).
 */
export function getSortedPlContent(imgMaxArea: number, uri: string): Promise<Song[]> {
  const songsPromise = getPlContent(imgMaxArea, uri);
  return sortMediaLocationsIfNotFromLocalPl(uri, songsPromise);
}

export function getSelectableNoImgPlContent(playlistUri: string): Promise<SelectableSong[]> {
  return getNoImgPlContent(playlistUri).then((playlist) => playlist.map((s) => toSelected(s)));
}

/**
 * Get the playlist content from audio-web-services (no images!).
 * Alternative to getMpcSortedNoImgPlContent.
 */
export function getSortedNoImgPlContent(playlistUri: string): Promise<Song[]> {
  const noImgSongs = getNoImgPlContent(playlistUri);
  return sortMediaLocationsIfNotFromLocalPl(playlistUri, noImgSongs);
}

/**
 * alternative to getPlContent from mpc.ts (though still using Mopidy)
 */
export function getPlContent(imgMaxArea: number, uri: string): Promise<Song[]> {
  // Nginx decodes 1x the received requests so 1x encoded "m3u:[Radio Streams].m3u8"
  // becomes "m3u:[Radio Streams].m3u8" when passed to upstream (aka, java).
  //
  // "m3u:[Radio Streams].m3u8" contains special characters (i.e., space [ and ])
  // which must be encoded, otherwise the request is not passed to the Nginx's upstream!
  //
  // 2x encoded "m3u:[Radio Streams].m3u8" becomes "m3u%3A%5BRadio%20Streams%5D.m3u8"
  // for the upstream; PlaylistsService.getPlItems pass it to Mopidy but Mopidy can't
  // decode the encoded : character (i.e. %3A); solved with java.net.URLDecoder.decode.
  const doubleEncodedUri = encodeURIComponent(encodeURIComponent(uri));
  // console.log(`[getYTPlContent] double encoded ytUri = `, doubleEncodedUri);
  return get<RefWithImages[]>(`${MOPIDY_PLAYLIST}/${doubleEncodedUri}`).then((rwis) =>
    refWithImagesToSongs(rwis, imgMaxArea)
  );
}

export function getNoImgPlContent(playlistUri: string): Promise<Song[]> {
  const doubleEncodedUri = encodeURIComponent(encodeURIComponent(playlistUri));
  // console.log(`[getYTPlContent] double encoded ytUri = `, doubleEncodedUri);
  return get<RefWithImages[]>(`${MOPIDY_PLAYLIST}/${doubleEncodedUri}`).then((rwis) =>
    refWithImagesToSongs(rwis)
  );
}
