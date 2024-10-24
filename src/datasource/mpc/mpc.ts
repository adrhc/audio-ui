import Mopidy, { models } from 'mopidy';
import { MOPIDY_DISCONNECTED_ERROR } from '../../constants';
import { getArtists } from '../../domain/track';

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

export function clearTrackList(mopidy: Mopidy | undefined) {
  return mopidy?.tracklist == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.tracklist.clear();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPlContent(mopidy: Mopidy | undefined, uri: string): Promise<models.Ref<any>[]> {
  return mopidy?.playlists == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.playlists.getItems({ uri }).then((it) => it ?? []);
}

/**
 * models.Ref.uri example: m3u:Marcin%20Patrzalek.m3u8
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPlaylists(mopidy: Mopidy | undefined): Promise<models.Ref<any>[]> {
  return mopidy?.playlists == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playlists.asList();
}

export function getImages(mopidy: Mopidy | undefined, uris: string[]): Promise<UriImagesMap> {
  return mopidy?.library == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.library.getImages({ uris });
}

export function previous(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.previous();
}

export function next(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.next();
}

export function stop(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.stop();
}

export function pause(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.pause();
}

export function resume(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.resume();
}

export function removeTlid(mopidy: Mopidy | undefined, tlid: number) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : // @ts-expect-error tlid is asked to be string though it should be number
      mopidy.tracklist.remove({ criteria: { tlid: [tlid] } });
}

export function play(mopidy?: Mopidy, tlid?: number) {
  return mopidy?.playback == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.playback.play({ tlid });
}

export function getTlTracks(mopidy?: Mopidy): Promise<models.TlTrack[]> {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.getTlTracks();
}

export function addUrisAfter(mopidy: Mopidy | undefined, afterTlid: number, ...uris: string[]) {
  const tracklist = mopidy?.tracklist;
  return tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : tracklist.index({ tlid: afterTlid })?.then((index) => {
        if (index == null) {
          return addUris(mopidy, ...uris);
        } else {
          return tracklist.add({ uris, at_position: index + 1 });
        }
      });
}

export function addUris(mopidy: Mopidy | undefined, ...uris: string[]) {
  if (uris.length == 0) {
    return Promise.reject("Can't add an empty uri list to the playlist!");
  } else if (mopidy?.tracklist == null) {
    return Promise.reject(MOPIDY_DISCONNECTED_ERROR);
  } else {
    // console.log(`[addUris] uris:`, uris);
    return mopidy.tracklist.add({ uris });
  }
}

export function getCurrentTlTrack(mopidy?: Mopidy): Promise<models.TlTrack | null> {
  return mopidy?.playback == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.playback.getCurrentTlTrack();
}

export function getVolume(mopidy?: Mopidy) {
  return mopidy?.mixer == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.mixer.getVolume();
}

export function getMute(mopidy?: Mopidy) {
  return mopidy?.mixer == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.mixer.getMute();
}

export function getState(mopidy?: Mopidy) {
  return mopidy?.playback == null ? Promise.reject(MOPIDY_DISCONNECTED_ERROR) : mopidy.playback.getState();
}

export function setConsume(mopidy: Mopidy | undefined, value: boolean) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.setConsume({ value });
}

export function setRandom(mopidy: Mopidy | undefined, value: boolean) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.setRandom({ value });
}

export function setRepeat(mopidy: Mopidy | undefined, value: boolean) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.setRepeat({ value });
}

export function setSingle(mopidy: Mopidy | undefined, value: boolean) {
  return mopidy?.tracklist == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.tracklist.setSingle({ value });
}

export function mute(mopidy: Mopidy | undefined, newMute: boolean) {
  return mopidy?.mixer == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.mixer.setMute({ mute: newMute }).then((success: boolean) => {
        if (!success) {
          return Promise.reject(new Error(`Couldn't mute!`));
        }
      });
}

export function setVolume(mopidy: Mopidy | undefined, newVolume: number) {
  console.log(`[Mopidy:setVolume] newVolume = ${newVolume} (it'll be trunked to [0,100])`);
  newVolume = truncateVolume(newVolume);
  return mopidy?.mixer == null
    ? Promise.reject(MOPIDY_DISCONNECTED_ERROR)
    : mopidy.mixer.setVolume({ volume: newVolume }).then((success: boolean) => {
        if (!success) {
          return Promise.reject(new Error(`Couldn't set the volume to ${newVolume}!`));
        }
      });
}

export function truncateVolume(volume?: number | null) {
  return volume == null ? 0 : Math.max(0, Math.min(100, volume));
}

export type PlayOptions = { consume?: boolean; random?: boolean; repeat?: boolean; single?: boolean };

export function getPlayOptions(mopidy?: Mopidy): Promise<PlayOptions> {
  return Promise.all([
    mopidy?.tracklist?.getConsume(),
    mopidy?.tracklist?.getRandom(),
    mopidy?.tracklist?.getRepeat(),
    mopidy?.tracklist?.getSingle(),
  ]).then(([consume, random, repeat, single]) => ({ consume, random, repeat, single }) as PlayOptions);
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

export async function showPlaybackInfo(mopidy: Mopidy) {
  console.log('getCurrentTlTrack:', await mopidy.playback?.getCurrentTlTrack());
  console.log('getStreamTitle:', await mopidy.playback?.getStreamTitle());
  // console.log('getTimePosition:', await mopidy.playback?.getTimePosition());
  const trackPromise = mopidy.playback?.getCurrentTrack();
  const statePromise = mopidy.playback?.getState();
  const timePositionPromise = mopidy.playback?.getTimePosition();

  const track = await trackPromise;
  const state = await statePromise;
  const timePosition = await timePositionPromise;

  if (state === 'stopped') {
    return;
  }

  const artists = track?.artists?.map((a) => a.name).join(', ');
  console.log(`${artists || ''} - ${track?.name}`);
  console.log(`[${state}] ${renderTrackNumber(track)}   ` + `${renderPosition(track, timePosition)}`);
}

export async function showTracklistInfo(mopidy: Mopidy) {
  const volumePromise = mopidy.mixer?.getVolume();
  const repeatPromise = mopidy.tracklist?.getRepeat();
  const randomPromise = mopidy.tracklist?.getRandom();
  const singlePromise = mopidy.tracklist?.getSingle();
  const consumePromise = mopidy.tracklist?.getConsume();

  const volume = (await volumePromise)?.toString().padStart(3, ' ');
  const repeat = ((await repeatPromise) && 'on ') || 'off';
  const random = ((await randomPromise) && 'on ') || 'off';
  const single = ((await singlePromise) && 'on ') || 'off';
  const consume = ((await consumePromise) && 'on ') || 'off';

  console.log(
    `volume:${volume}%   ` +
      `repeat: ${repeat}   ` +
      `random: ${random}   ` +
      `single: ${single}   ` +
      `consume: ${consume}`
  );
}

function renderTrackNumber(track: Mopidy.models.Track | null | undefined) {
  return `#${track?.track_no || '-'}/${track?.album?.num_tracks || '-'}`;
}

function renderPosition(
  track: Mopidy.models.Track | null | undefined,
  timePosition: number | null | undefined
) {
  const pos = renderTime(timePosition);
  const length = renderTime(track?.length);
  const percentage = Math.floor((timePosition ?? 0 * 100) / (track?.length || 1));
  return `${pos}/${length} (${percentage}%)`;
}

function renderTime(timeInSeconds: number | null | undefined) {
  const minutes = Math.floor(timeInSeconds ?? 0 / 1000 / 60);
  const seconds = Math.floor((timeInSeconds ?? 0 / 1000) % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}
