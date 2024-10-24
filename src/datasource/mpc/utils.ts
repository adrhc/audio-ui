import { getArtists } from '../../domain/track';
import { models } from 'mopidy';

/**
 * models.Ref.uri example: m3u:Marcin%20Patrzalek.m3u8
 */
export function isM3uMpcRefUri(uri: string) {
  return uri.startsWith('m3u:');
}

/**
 * models.Ref.uri example: m3u:Marcin%20Patrzalek.m3u8
 */
export function m3uMpcRefUriToDecodedFileName(mpcRefUri: string) {
  return decodeURIComponent(m3uMpcRefUriToEncodedFileName(mpcRefUri));
}

/**
 * models.Ref.uri example: m3u:Marcin%20Patrzalek.m3u8
 */
export function m3uMpcRefUriToEncodedFileName(mpcRefUri: string) {
  return mpcRefUri.substring(4);
}

export function logTlTrack(tlt: models.TlTrack | null) {
  const track = tlt?.track;
  if (!track) {
    return;
  }
  const artists = getArtists(track);
  const composers = track?.composers?.map((a) => a.name).join(', ');
  const performers = track?.performers?.map((a) => a.name).join(', ');
  console.log(
    `${Date.now()}\ntlid = ${tlt?.tlid}\nuri = ${track?.uri}\nname = ${track?.name}\nalbum: ${track?.album?.name}\nartists: ${artists}\nlength = ${track?.length}\ncomment = ${track?.comment}\ncomposers: ${composers}\nperformers: ${performers}\ntrack_no = ${track?.track_no}\ndisc_no = ${track?.disc_no}\ngenre = ${track?.genre}\nbitrate = ${track?.bitrate}\nMusicBrainz ID = ${track?.musicbrainz_id}`
  );
}
