import Mopidy from 'mopidy';
import { addUrisToTrackListIn2Steps, addUrisToTrackListIn2StepsAfter } from '../mpc/playing-list';
import { addToHistory } from '../../audio-db/history/history';
import { Track } from '../../../domain/track';
import { Song } from '../../../domain/song';
import { play } from '../player';

export function addSongsAfterAndRemember(
  mopidy: Mopidy | undefined,
  after: Track | undefined | null,
  ...songs: Song[]
) {
  return addSongsAfter(mopidy, after, ...songs)?.then(addToHistory);
}

export function addSongsAfter(mopidy: Mopidy | undefined, after: Track | undefined | null, ...songs: Song[]) {
  if (after?.tlid == null) {
    return addSongs(mopidy, ...songs);
  } else {
    const uris = songs.map((it) => it.uri);
    return addUrisToTrackListIn2StepsAfter(mopidy, after.tlid, ...uris);
  }
}

export function addSongsAndRemember(mopidy: Mopidy | undefined, ...songs: Song[]) {
  return addSongs(mopidy, ...songs)?.then(addToHistory);
}

export function addSongs(mopidy: Mopidy | undefined, ...songs: Song[]) {
  return addUrisToTrackListIn2Steps(
    mopidy?.tracklist,
    songs.map((it) => it.uri)
  );
}

export function addSongThenPlay(mopidy: Mopidy | undefined, song: Song) {
  return addUrisThenPlay(mopidy, song.uri);
}

/**
 * Added to history by audio-web-services when the song is played!
 */
export function addUrisThenPlay(mopidy: Mopidy | undefined, ...uris: string[]) {
  return addUrisToTrackListIn2Steps(mopidy?.tracklist, uris)?.then((tk) => {
    tk.length && play(mopidy, tk[0].tlid);
  });
}
