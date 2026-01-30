import Mopidy from 'mopidy';
import { getImages } from '../mpc/mpc';
import { getCurrentTlTrack, getTlTracks } from '../mpc/playing-list';
import { SelectableTrack, Track, toSelectableTrack, toTrack } from '../../../domain/track';
import { toSongUris } from '../../../domain/song';
import { getNoImgPlContent } from '../../audio-ws/playlist/playlist';
import { addImgUriToSongs } from '../types';

export function getCurrentTrack(mopidy?: Mopidy): Promise<Track | null> {
  return getCurrentTlTrack(mopidy)?.then(toTrack);
}

export async function getSelectableTracks(
  mopidy: Mopidy | undefined,
  playlistUri: string,
  imgMaxEdge: number
): Promise<SelectableTrack[]> {
  const tracks = await getTracks(mopidy, imgMaxEdge);
  const songs = await getNoImgPlContent(playlistUri);
  return tracks.map((t) => toSelectableTrack(songs, t));
}

export async function getTracks(mopidy: Mopidy | undefined, imgMaxEdge: number): Promise<Track[]> {
  const tlt = await getTlTracks(mopidy);
  const traks = tlt.map(toTrack).filter((it) => it != null) as Track[];
  const imagesMap = await getImages(mopidy, toSongUris(traks));
  return addImgUriToSongs(imgMaxEdge, imagesMap, traks);
}
