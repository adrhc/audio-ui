import Mopidy, { models } from 'mopidy';

export function previous(mopidy?: Mopidy | null) {
  return mopidy?.playback?.previous().catch((reason) => {
    alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
  });
}

export function next(mopidy?: Mopidy | null) {
  return mopidy?.playback?.next().catch((reason) => {
    alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
  });
}

export function stop(mopidy?: Mopidy | null) {
  return mopidy?.playback?.stop().catch((reason) => {
    alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
  });
}

export function pause(mopidy?: Mopidy | null) {
  return mopidy?.playback?.pause().catch((reason) => {
    alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
  });
}

export function resume(mopidy?: Mopidy | null) {
  return mopidy?.playback?.resume().catch((reason) => {
    alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
  });
}

export function play(mopidy?: Mopidy | null) {
  return mopidy?.playback?.play({}).catch((reason) => {
    alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
  });
}

export function getCurrentTlTrack(onSuccess: (tlt: models.TlTrack | null) => void, mopidy?: Mopidy | null) {
  return mopidy?.playback
    ?.getCurrentTlTrack()
    .then((tlt: models.TlTrack | null) => {
      onSuccess(tlt);
    })
    .catch((reason) => {
      alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
    });
}

export function mute(mopidy: Mopidy | null, newMute: boolean) {
  return mopidy?.mixer
    ?.setMute({ mute: newMute })
    .then((success: boolean) => {
      if (!success) {
        alert(`Couldn't mute!`);
      }
    })
    .catch((reason) => {
      alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
    });
}

export function setVolume(mopidy: Mopidy | null, newVolume: number) {
  return mopidy?.mixer
    ?.setVolume({ volume: newVolume })
    .then((success: boolean) => {
      if (!success) {
        alert(`Couldn't change the volume to ${newVolume}!`);
      }
    })
    .catch((reason) => {
      alert(typeof reason === 'string' ? reason : JSON.stringify(reason));
    });
}

export async function showPlaybackInfo(mopidy: Mopidy) {
  console.log('getCurrentTlTrack:', await mopidy.playback?.getCurrentTlTrack());
  // console.log('getStreamTitle:', await mopidy.playback?.getStreamTitle());
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

export function getArtists(track: models.Track | undefined | null) {
  return track?.artists?.map((a) => a.name).join(', ');
}

export function logTlTrack(tlt: models.TlTrack | null) {
  const track = tlt?.track;
  const artists = getArtists(track);
  const composers = track?.composers?.map((a) => a.name).join(', ');
  const performers = track?.performers?.map((a) => a.name).join(', ');
  console.log(
    `tlid = ${tlt?.tlid}\nuri = ${track?.uri}\nname = ${track?.name}\nalbum: ${track?.album?.name}\nartists: ${artists}\nlength = ${track?.length}\ncomment = ${track?.comment}\ncomposers: ${composers}\nperformers: ${performers}\ntrack_no = ${track?.track_no}\ndisc_no = ${track?.disc_no}\ngenre = ${track?.genre}\nbitrate = ${track?.bitrate}\nMusicBrainz ID = ${track?.musicbrainz_id}`
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
