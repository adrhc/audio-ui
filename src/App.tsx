import { Alert, Box, IconButton, Snackbar, Stack, useTheme } from '@mui/material';
import Mopidy, { models } from 'mopidy';
import { useCallback, useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { MopidyEvent, PlaybackState } from './domain/types';
import { ifIPhone, isIPhone } from './lib/agent';
import { omitProps } from './lib/object';
import { getSongAndBoost, getVolumeBoost } from './infrastructure/audio-ws/boost/boost';
import Spinner from './components/feedback/Spinner';
import CloseableAlert from './components/feedback/ErrorAlert';
import { AppContext } from './hooks/AppContext';
import { useBaseVolume } from './hooks/useBaseVolume';
import useAppState, { AppState } from './hooks/useAppState';
import {
  refreshSharedStateAndGet,
  reloadServerState,
} from './infrastructure/audio-ws/playback/playback';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingState } from './lib/sustain';
import { useCache } from './hooks/cache/useCache';
import { setGlobalAuthorization } from './domain/credentials';
import { areSameTrack, toTrack } from './domain/track';
import { AudioServerState } from './infrastructure/audio-ws/playback/types';

export default function App() {
  const theme = useTheme();
  const { setBaseVolume, ...baseVolume } = useBaseVolume();
  const { state, sustain, setState, setBoost, clearNotification, setNotification, setCredentials } =
    useAppState();

  const { mopidy, loading, currentSong, pbStatus, notification, severity, credentials } = state;
  // console.log(`[App] iPhone = ${isIPhone()}, state:`, state);

  const handleServerState = useCallback(
    (notification: string, serverState: AudioServerState) => {
      const { pbStatus, currentSong, streamTitle, baseVolume, mute, boost } = serverState;
      console.log(`[App:handleServerState] notification = ${notification}, serverState:`, serverState);
      setBaseVolume(baseVolume);
      return {
        severity: 'info',
        notification,
        pbStatus,
        currentSong,
        streamTitle,
        volume: baseVolume + boost,
        boost,
        mute,
      } as LoadingState<AppState>;
    },
    [setBaseVolume]
  );

  const reloadState = useCallback(() => {
    sustain(
      reloadServerState().then((ss) => handleServerState('State reloaded!', ss)),
      "Failed to reload the application's state!"
    );
  }, [handleServerState, sustain]);

  const handleStateOnline = useCallback(() => {
    // console.log(`[App.handleStateOnline]`);
    sustain(
      refreshSharedStateAndGet()
        .then((ss) => handleServerState('Mopidy got back online!', ss))
        .then((it) => ({ ...it, online: true })),
      { online: true, error: 'State loading error!' },
      true // otherwise the App spinner is presented
    );
  }, [handleServerState, sustain]);

  const handleStateOffline = useCallback(() => {
    console.warn(`[App:state:offline]`);
    setState((old) => ({ ...old, online: false, severity: 'warning', notification: 'Mopidy went offline!' }));
  }, [setState]);

  const handleWebsocketError = useCallback(
    (e: object | string) => {
      console.error(`[App:websocket:error]`, e);
      setState((old) => ({
        ...old,
        severity: 'error',
        notification: 'A Mopidy communication error occurred!',
      }));
    },
    [setState]
  );

  const handleWebsocketClose = useCallback(() => {
    console.warn(`[App:websocket:close]`);
    setState((old) => ({
      ...old,
      severity: 'error',
      notification: 'Mopidy communication failed (websocket closed)!',
    }));
  }, [setState]);

  const handleMuteChanged = useCallback(
    ({ mute }: { mute: boolean }) => setState((old) => ({ ...old, mute })),
    [setState]
  );

  const handleVolumeChanged = useCallback(
    ({ volume }: { volume: number }) => {
      console.log(`[App:event:volumeChanged] volume = ${volume}`);
      if (!mopidy) {
        return;
      }
      setState((stateAtVolChgEvent) => {
        if (
          stateAtVolChgEvent.volume == volume &&
          (stateAtVolChgEvent.pbStatus == 'paused' || stateAtVolChgEvent.pbStatus == 'stopped')
        ) {
          console.log(`[App:event:volumeChanged] loading the current Mopidy track ...`);
          // prev/next navigation when nothing plays
          getSongAndBoost(mopidy)?.then((sab) => {
            // stateAtVolumeChangedEvent.currentSong should differ
            // than the one from Mopidy hence resetting streamTitle
            if (stateAtVolChgEvent.currentSong?.uri != sab.currentSong?.uri) {
              console.log(`[App:event:volumeChanged] switched to:`, {
                mopidyTrack: sab.currentSong,
                newBoost: sab.boost,
                stateAtVolChgEvent,
              });
              setState((old) => ({
                ...old,
                currentSong: sab.currentSong,
                boost: sab.boost?.boost ?? 0,
                streamTitle: null,
              }));
            } else {
              console.warn(`[App:event:volumeChanged] current Mopidy track didn't change:`, {
                newBoost: sab.boost, // most probably the boost didn't change too!
                stateAtVolChgEvent,
              });
            }
          });
        }
        return { ...stateAtVolChgEvent, volume };
      });
    },
    [mopidy, setState]
  );

  const handlePlaybackStateChanged = useCallback(
    ({ old_state, new_state: pbStatus }: { old_state: PlaybackState; new_state: PlaybackState }) => {
      console.log(`[App:event:playbackStateChanged] pbStatus = ${pbStatus}, oldState = ${old_state}`);
      setState((old) => ({
        ...old,
        pbStatus,
        // severity: 'info',
        // notification: `Playback state changed to ${pbStatus}!`,
      }));
    },
    [setState]
  );

  const handleTrackPlaybackStarted = useCallback(
    (params: { tl_track: models.TlTrack }) => {
      // console.log(`[App:event:trackPlaybackStarted] ${Date.now()}, TlTrack:`);
      // logTlTrack(params.tl_track);
      const currentSong = toTrack(params.tl_track);
      if (currentSong) {
        // this catches prev/next navigation only when a track is playing
        setState((old) => {
          const sameTrack = areSameTrack(currentSong, old.currentSong);
          if (sameTrack) {
            return old;
          } else {
            console.log(
              `[App:event:trackPlaybackStarted] boost was set to 0 while switching to:`,
              currentSong
            );
            return {
              ...old,
              currentSong: currentSong,
              streamTitle: null,
              boost: 0,
              // severity: 'info',
              // notification: `Playback started! boost was set to 0 while switching to ${currentSong.uri}`,
            };
          }
        });
      } else {
        console.log(`[App:event:trackPlaybackStarted] can't switch to:`, currentSong);
        setState((old) => ({ ...old, error: 'The current song has no uri!' }));
      }
    },
    [setState]
  );

  const handleTrackPlaybackResumed = useCallback(
    (params: { tl_track: models.TlTrack }) => {
      // console.log(`[App:event:trackPlaybackResumed] ${Date.now()}, TlTrack:`);
      // logTlTrack(params.tl_track);
      const currentSong = toTrack(params.tl_track);
      if (!currentSong) {
        console.log(`[App:event:trackPlaybackResumed] can't switch to:`, currentSong);
        setState((old) => ({ ...old, error: 'The current song has no uri!' }));
      }
    },
    [setState]
  );

  const handleStreamTitleChanged = useCallback(
    ({ title }: { title: string }) => {
      setState((old) => {
        // console.log(`[App:event:streamTitleChanged] streamTitle = ${title}, oldState:`, old);
        // return { ...old, streamTitle: title, severity: 'info', notification: `Stream title changed!` };
        return { ...old, streamTitle: title };
      });
    },
    [setState]
  );

  // events: state:online
  useEffect(() => {
    console.log(`[App:useEffect:state:online] init`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push(['state:online', handleStateOnline]);

    events.forEach((e) => mopidy?.on(...e));

    return () => {
      console.log(`[App:useEffect:state:online] destroy`);
      events.forEach((e) => mopidy?.off(...e));
    };
  }, [mopidy, handleStateOnline]);

  // events: websocket:error, websocket:close, state:offline, event:muteChanged, event:volumeChanged
  useEffect(() => {
    console.log(`[App:useEffect:events] init`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push(['websocket:error', handleWebsocketError]);

    events.push(['websocket:close', handleWebsocketClose]);

    events.push(['state:offline', handleStateOffline]);

    events.push(['event:muteChanged', handleMuteChanged]);

    /* events.push([
      'websocket:incomingMessage',
      (param: { data?: unknown } | null) => {
        if (param?.data) {
          const data = typeof param?.data == 'string' ? JSON.parse(param?.data) : param?.data;
          const event = data?.event;
          if (event == 'volume_changed') {
            console.log(`[websocket:incomingMessage] ${event ? `event = ${event}, ` : ''}param:\n`, param);
            // console.log(`[websocket:incomingMessage] ${event ? `event = ${event}, ` : ''}data:\n`, data);
          }
        } else {
          console.log(`[websocket:incomingMessage] param:\n`, param);
        }
      },
    ]); */

    // previous/next buttons trigger event:volumeChanged
    events.push(['event:volumeChanged', handleVolumeChanged]);

    /* events.push(['event', (args?: unknown) => {
      console.log(`[App:event] args:`, args);
    }]);

    events.push(['state', (args?: unknown) => {
      console.log(`[App:state] args:`, args);
    }]); */

    events.forEach((e) => mopidy?.on(...e));

    return () => {
      console.log(`[App:useEffect:events] destroy`);
      events.forEach((e) => mopidy?.off(...e));
    };
  }, [
    handleMuteChanged,
    handleStateOffline,
    handleVolumeChanged,
    handleWebsocketClose,
    handleWebsocketError,
    mopidy,
  ]);

  // events: event:playbackStateChanged, event:trackPlaybackStarted, event:trackPlaybackResumed, event:streamTitleChanged
  useEffect(() => {
    console.log(`[App:useEffect:songSelection] init`);
    const events: MopidyEvent<keyof Mopidy.StrictEvents>[] = [];

    events.push(['event:playbackStateChanged', handlePlaybackStateChanged]);

    events.push(['event:trackPlaybackStarted', handleTrackPlaybackStarted]);

    events.push(['event:trackPlaybackResumed', handleTrackPlaybackResumed]);

    events.push(['event:streamTitleChanged', handleStreamTitleChanged]);

    events.forEach((e) => mopidy?.on(...e));

    return () => {
      console.log(`[App:useEffect:songSelection] destroy`);
      events.forEach((e) => mopidy?.off(...e));
    };
  }, [
    handlePlaybackStateChanged,
    handleStreamTitleChanged,
    handleTrackPlaybackResumed,
    handleTrackPlaybackStarted,
    mopidy,
  ]);

  /**
   * The boost for currentSong is computed only by the below useEffect when pbStatus == 'playing'.
   * The boost for currentSong is computed by event:volumeChanged for pbStatus != 'playing'.
   *
   * ATTENTION: don't depend on currentSong because it's an object so,
   * even if the same it'll still be seen as a change by this effect!
   */
  const playingSongUri = pbStatus == 'playing' ? currentSong?.uri : null;

  useEffect(() => {
    if (playingSongUri == null) {
      console.warn(`[useEffect:playingSongUri] bad song (uri is null) or no song is playing`);
      return;
    }
    getVolumeBoost(playingSongUri)
      .then((vb) =>
        setState((old) => {
          if (old.currentSong?.uri == (vb?.uri ?? playingSongUri)) {
            console.log(`[useEffect:playingSongUri] updating volumeBoost to:`, vb);
            // console.log(`[useEffect:playingSongUri] old state:`, old);
            return { ...old, boost: vb?.boost ?? 0 };
          } else {
            console.warn(`[useEffect:playingSongUri] volumeBoost doesn't match current song uri!`, {
              currentState: old,
              volumeBoost: vb,
            });
            return old;
          }
        })
      )
      .catch(console.error);
  }, [playingSongUri, setState]);

  useEffect(() => {
    const securedProtocol = window.location.protocol == 'https:';
    let webSocketUrl: string | undefined;
    if (securedProtocol && credentials.isValid()) {
      console.log(
        `[App.useEffect] wss://${credentials.user}:${credentials.encodedPassword()}@${window.location.host}/mopidy/ws`
      );
      webSocketUrl = `wss://${credentials.user}:${credentials.encodedPassword()}@${window.location.host}/mopidy/ws`;
      setGlobalAuthorization(credentials.token());
    } else {
      setGlobalAuthorization(undefined);
    }
    setState((old) => {
      if (old.mopidy) {
        console.log(`[App:login] closing current Mopidy`);
        old.mopidy.close();
        old.mopidy.off();
      }
      // console.log(`[App:login] connecting to ${webSocketUrl??''}`);
      console.log(`[App:login] connecting to ${webSocketUrl == null ? 'public Mopidy' : 'secured Mopidy'}`);
      if (webSocketUrl) {
        // https://ably.com/blog/websocket-authentication
        // const webSocket = new WebSocket(webSocketUrl, ['Authorization', credentials.token()!]);
        const webSocket = new WebSocket(webSocketUrl);
        return { ...old, mopidy: new Mopidy({ webSocketUrl, webSocket }) };
      } else {
        return { ...old, mopidy: new Mopidy({ webSocketUrl: '' }) };
      }
    });
  }, [credentials, setState]);

  const iphoneBottomSpace = useMemo(() => ifIPhone(theme.spacing(1.25), '0px'), [theme]);

  return (
    <>
      <Spinner show={loading} />
      <Stack
        sx={{
          p: [0.5, 1],
          height: `calc(100% - ${iphoneBottomSpace})`,
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          // backgroundColor: 'yellow',
        }}
      >
        {/* <Logs logs={logs} /> */}
        <CloseableAlert message={state?.error} onClose={() => setState((old) => ({ ...old, error: '' }))} />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!notification}
          autoHideDuration={2000}
          onClose={clearNotification}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={clearNotification}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Alert onClose={clearNotification} severity={severity} variant="filled" sx={{ width: '100%' }}>
            {notification}
          </Alert>
        </Snackbar>
        <AppContext.Provider
          value={{
            ...omitProps(state, ['error', 'loading', 'notification', 'severity', 'logs']),
            setBaseVolume,
            ...baseVolume,
            setBoost,
            ...useCache(),
            setNotification,
            reloadState,
            setCredentials,
            credentials,
          }}
        >
          <Outlet />
        </AppContext.Provider>
      </Stack>
      {isIPhone() && <Box role="elevating" sx={{ height: iphoneBottomSpace }} />}
    </>
  );
}
