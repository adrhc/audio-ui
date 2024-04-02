import Mopidy from "mopidy";

export async function showPlaybackInfo(mopidy: Mopidy) {
  const trackPromise = mopidy.playback.getCurrentTrack();
  const statePromise = mopidy.playback.getState();
  const timePositionPromise = mopidy.playback.getTimePosition();

  const track = await trackPromise;
  const state = await statePromise;
  const timePosition = await timePositionPromise;

  if (state === 'stopped') {
    return;
  }

  const artists = track.artists.map((a) => a.name).join(', ');
  console.log(`${artists} - ${track.name}`);
  console.log(`[${state}] ${renderTrackNumber(track)}   ` + `${renderPosition(track, timePosition)}`);
}

export async function showTracklistInfo(mopidy: Mopidy) {
  const volumePromise = mopidy.mixer.getVolume();
  const repeatPromise = mopidy.tracklist.getRepeat();
  const randomPromise = mopidy.tracklist.getRandom();
  const singlePromise = mopidy.tracklist.getSingle();
  const consumePromise = mopidy.tracklist.getConsume();

  const volume = (await volumePromise).toString().padStart(3, ' ');
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
