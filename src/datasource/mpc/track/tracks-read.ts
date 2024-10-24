import Mopidy from 'mopidy';
import { getCurrentTlTrack, getImages, getTlTracks } from '../mpc';
import { SelectableTrack, Track, toSelectableTrack, toTrack } from '../../../domain/track';
import { toSongUris } from '../../../domain/song';
import { getNoImgPlContent } from '../../audio-ws/playlist/playlist';
import { addImgUriToMany } from '../types';

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

export function getTracks(mopidy: Mopidy | undefined, imgMaxEdge: number): Promise<Track[]> {
  return getTlTracks(mopidy)
    ?.then((tlt) => tlt.map(toTrack).filter((it) => it != null) as Track[])
    .then((traks) =>
      getImages(mopidy, toSongUris(traks))?.then((imagesMap) =>
        addImgUriToMany(imgMaxEdge, traks, imagesMap)
      )
    );
}
