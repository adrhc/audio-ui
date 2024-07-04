import Mopidy from 'mopidy';
import { getCurrentTlTrack, getImages, getTlTracks } from './mpc';
import { TrackSong, toTrackSong } from '../domain/track-song';
import { toSongExtsWithImgUri, toSongUris } from '../domain/song';

export function getCurrentTrackSong(mopidy?: Mopidy): Promise<TrackSong | null> {
  return getCurrentTlTrack(mopidy)?.then(toTrackSong);
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
