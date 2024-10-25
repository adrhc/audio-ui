import Mopidy from 'mopidy';
import { addUris, addUrisAfter } from '../mpc/playing-list';
import { addToHistory } from '../../audio-db/history/history';
import { Track } from '../../../domain/track';
import { Song } from '../../../domain/song';
import { play } from '../player';

export function addSongsAfterAndRemember(
  mopidy: Mopidy | undefined,
  after: Track | undefined | null,
  ...song: Song[]
) {
  if (after?.tlid == null) {
    return addSongsAndRemember(mopidy, ...song);
  } else {
    const uris = song.map((it) => it.uri);
    return addUrisAfter(mopidy, after.tlid, ...uris)?.then(addToHistory);
  }
}

export function addSongsAndRemember(mopidy: Mopidy | undefined, ...song: Song[]) {
  const uris = song.map((it) => it.uri);
  return addUrisAndRemember(mopidy, ...uris);
}

export function addUrisAndRemember(mopidy: Mopidy | undefined, ...uris: string[]) {
  return addUris(mopidy, ...uris)?.then(addToHistory);
}

export function addSongThenPlay(mopidy: Mopidy | undefined, song: Song) {
  return addUrisThenPlay(mopidy, song.uri);
}

export function addUrisThenPlay(mopidy: Mopidy | undefined, ...uris: string[]) {
  return addUris(mopidy, ...uris)?.then((tk) => {
    tk.length && play(mopidy, tk[0].tlid);
  });
}
