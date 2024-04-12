import Mopidy, { models } from 'mopidy';
import { formatErr } from './logging';

export type SongAndArtists = {
  tlid?: number;
  song?: string | null;
  artists?: string | null;
  uri?: string | null;
  imgUri?: string | null;
};

export function toSongAndArtists(tlt: models.TlTrack | null) {
  // logTlTrack(tlt);
  const song = tlt?.track?.name ?? tlt?.track?.comment ?? tlt?.track?.uri;
  const uri = tlt?.track?.uri ?? tlt?.track?.album?.uri;
  const artists = getArtists(tlt?.track);
  return { tlid: tlt?.tlid, song, artists, uri } as SongAndArtists;
}

export function getTrackList(mopidy: Mopidy) {
  return getTlTracks(mopidy)?.then((tlt) => tlt.map(toSongAndArtists));
}

export function getImages(mopidy: Mopidy, uris: string[]) {
  return mopidy.library?.getImages({uris}).catch((reason) => alert(formatErr(reason)));
}

export function getSongAndArtists(mopidy: Mopidy) {
  return getCurrentTlTrack(mopidy)?.then(toSongAndArtists);
}

export function previous(mopidy: Mopidy) {
  return mopidy.playback?.previous().catch((reason) => alert(formatErr(reason)));
}

export function next(mopidy: Mopidy) {
  return mopidy.playback?.next().catch((reason) => alert(formatErr(reason)));
}

export function stop(mopidy: Mopidy) {
  return mopidy.playback?.stop().catch((reason) => alert(formatErr(reason)));
}

export function pause(mopidy: Mopidy) {
  return mopidy.playback?.pause().catch((reason) => alert(formatErr(reason)));
}

export function resume(mopidy: Mopidy) {
  return mopidy.playback?.resume().catch((reason) => alert(formatErr(reason)));
}

export function play(mopidy: Mopidy, tlid?: number) {
  return mopidy.playback?.play({ tlid });
  /* .catch((reason) => {
      alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
    }); */
}

export function getTlTracks(mopidy: Mopidy) {
  return mopidy.tracklist?.getTlTracks();
}

export function getCurrentTlTrack(mopidy: Mopidy) {
  return mopidy.playback?.getCurrentTlTrack();
}

export function setConsume(mopidy: Mopidy, value: boolean) {
  return mopidy.tracklist?.setConsume({ value }).catch((reason) => alert(formatErr(reason)));
}

export function setRandom(mopidy: Mopidy, value: boolean) {
  return mopidy.tracklist?.setRandom({ value }).catch((reason) => alert(formatErr(reason)));
}

export function setRepeat(mopidy: Mopidy, value: boolean) {
  return mopidy.tracklist?.setRepeat({ value }).catch((reason) => alert(formatErr(reason)));
}

export function setSingle(mopidy: Mopidy, value: boolean) {
  return mopidy.tracklist?.setSingle({ value }).catch((reason) => alert(formatErr(reason)));
}

export function mute(mopidy: Mopidy, newMute: boolean) {
  return mopidy.mixer
    ?.setMute({ mute: newMute })
    .then((success: boolean) => {
      if (!success) {
        alert(`Couldn't mute!`);
      }
    })
    .catch((reason) => alert(formatErr(reason)));
}

export function setVolume(mopidy: Mopidy, newVolume: number) {
  return mopidy.mixer
    ?.setVolume({ volume: newVolume })
    .then((success: boolean) => {
      if (!success) {
        alert(`Couldn't change the volume to ${newVolume}!`);
      }
    })
    .catch((reason) => alert(formatErr(reason)));
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

export type PlayOptions = { consume?: boolean; random?: boolean; repeat?: boolean; single?: boolean };

export function getPlayOptions(mopidy: Mopidy) {
  return Promise.all([
    mopidy.tracklist?.getConsume(),
    mopidy.tracklist?.getRandom(),
    mopidy.tracklist?.getRepeat(),
    mopidy.tracklist?.getSingle(),
  ]).then(([consume, random, repeat, single]) => ({ consume, random, repeat, single }) as PlayOptions);
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

export function getArtists(track: models.Track | undefined | null) {
  return track?.artists?.map((a) => a.name).join(', ');
}

export function logTlTrack(tlt: models.TlTrack | null) {
  const track = tlt?.track;
  const artists = getArtists(track);
  const composers = track?.composers?.map((a) => a.name).join(', ');
  const performers = track?.performers?.map((a) => a.name).join(', ');
  console.log(
    `${Date.now()}\ntlid = ${tlt?.tlid}\nuri = ${track?.uri}\nname = ${track?.name}\nalbum: ${track?.album?.name}\nartists: ${artists}\nlength = ${track?.length}\ncomment = ${track?.comment}\ncomposers: ${composers}\nperformers: ${performers}\ntrack_no = ${track?.track_no}\ndisc_no = ${track?.disc_no}\ngenre = ${track?.genre}\nbitrate = ${track?.bitrate}\nMusicBrainz ID = ${track?.musicbrainz_id}`
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
