import Mopidy from 'mopidy';
import { getCurrentTlTrack, getImages, getTlTracks } from './mpc';
import { SelectableTrackSong, TrackSong, toSelectableTrackSong, toTrackSong } from '../domain/track';
import { toSongExtsWithImgUri, toSongUris } from '../domain/song';
import { getNoImgPlContent } from './audio-ws/audio-ws';

export function getCurrentTrackSong(mopidy?: Mopidy): Promise<TrackSong | null> {
  return getCurrentTlTrack(mopidy)?.then(toTrackSong);
}

export async function getSelectableTrackSongs(
  mopidy: Mopidy | undefined,
  playlistUri: string,
  imgMaxEdge: number
): Promise<SelectableTrackSong[]> {
  const tracks = await getTrackSongs(mopidy, imgMaxEdge);
  const songs = await getNoImgPlContent(playlistUri);
  return tracks.map((t) => toSelectableTrackSong(songs, t));
}

export function getTrackSongs(mopidy: Mopidy | undefined, imgMaxEdge: number): Promise<TrackSong[]> {
  return getTlTracks(mopidy)
    ?.then((tlt) => tlt.map(toTrackSong).filter((it) => it != null) as TrackSong[])
    .then((traks) =>
      getImages(mopidy, toSongUris(traks))?.then((imagesMap) =>
        toSongExtsWithImgUri(imgMaxEdge, traks, imagesMap)
      )
    );
}
