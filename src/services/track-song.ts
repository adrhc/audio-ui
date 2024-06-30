import Mopidy from 'mopidy';
import { UriImagesMap, getCurrentTlTrack, getImages, getTlTracks } from './mpc';
import { sortByAbsDiff } from '../lib/image';
import { TrackSong, toTrackSong } from '../domain/track-song';

export function areSameTrack(tk1: TrackSong, tk2?: TrackSong): boolean {
  return tk1.tlid == tk2?.tlid && tk1.uri == tk2.uri;
}

export function getCurrentTrackSong(mopidy?: Mopidy): Promise<TrackSong | null> {
  return getCurrentTlTrack(mopidy)?.then(toTrackSong);
}

export function getTrackSongs(mopidy: Mopidy | undefined, imgMaxEdge: number): Promise<TrackSong[]> {
  return getTlTracks(mopidy)
    ?.then((tlt) => tlt.map(toTrackSong).filter((it) => it != null) as TrackSong[])
    .then((traks) =>
      getImages(mopidy, toSongUris(traks))?.then((imagesMap) =>
        toTracksWithImgUri(imgMaxEdge, traks, imagesMap)
      )
    );
}

function toTracksWithImgUri(imgMaxEdge: number, tracks: TrackSong[], imagesMap: UriImagesMap): TrackSong[] {
  const imgMaxArea = imgMaxEdge * imgMaxEdge;
  // console.log(`imagesMap:\n`, imagesMap);
  return tracks.map((track) => toTrackWithImgUri(imgMaxArea, imagesMap, track));
}

function toTrackWithImgUri(imgMaxArea: number, imagesMap: UriImagesMap, track: TrackSong): TrackSong {
  let images = track.uri ? imagesMap[track.uri] : undefined;
  images = sortByAbsDiff(imgMaxArea, images);
  // images.length && console.log(`images of ${track.uri}:\n`, images);
  track.imgUri = images?.[0]?.uri;
  return track;
}

function toSongUris(songs: TrackSong[]): string[] {
  return songs.map((s) => s.uri).filter((it) => !!it) as string[];
}
