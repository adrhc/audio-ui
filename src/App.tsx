import { Container } from '@mui/material';
import Mopidy from 'mopidy';
import { createContext, useEffect, useRef, useState, MutableRefObject } from 'react';
import { Outlet } from 'react-router-dom';
import Logs from './ui/Logs';
import { SHOW_LOGS } from './lib/config';

export const AppContext = createContext<AppContextValue>({} as AppContextValue);

export type AppContextValue = {
  online: boolean;
  mopidyRef: MutableRefObject<Mopidy | null>;
};

type AppState = {
  mopidyRef: MutableRefObject<Mopidy | null>;
  online: boolean;
  logs: string[];
};

export default function App() {
  const mopidyRef = useRef<Mopidy | null>(null);
  const [state, setState] = useState<AppState>({ mopidyRef, online: false, logs: [] });

  console.log(
    `[App] mopidyRef = ${!!mopidyRef.current}, online = ${state.online}, logs (${state.logs.length}):`,
    state.logs
  );

  function addLog(log: string) {
    SHOW_LOGS && setState((old) => ({ ...old, logs: [log, ...old.logs] }));
  }

  useEffect(() => {
    const mopidy = (mopidyRef.current = new Mopidy({ webSocketUrl: '' }));
    console.log(`[App:useEffect] online = ${state.online}`);

    /* mopidy.on(
      'websocket:incomingMessage',
      (param: { data: object | string | number | boolean | null } | null) => {
        if (typeof param?.data === 'string') {
          const json = JSON.parse(param.data);
          const result = json.result ?? json.tl_track;
          if (result && result['__model__'] === 'TlTrack') {
            console.log(`[App:websocket:incomingMessage] ${Date.now()}, TlTrack:`, json);
            logTlTrack(result as models.TlTrack);
            return;
          }
        }
        if (param?.data) {
          console.log(`[App:websocket:incomingMessage] ${Date.now()}, data:\n`, param.data);
        }
        // addLog(`[App:websocket:incomingMessage]`);
      }
    ); */

    mopidy.on('websocket:error', async (e: object | string) => {
      console.error(`[App:websocket:error]`, e);
      // console.error('Something went wrong with the Mopidy connection!', e);
      addLog(`[App:websocket:error] ${JSON.stringify(e, ['message', 'arguments', 'type', 'name'])}`);
    });

    mopidy.on('websocket:close', () => {
      console.log(`[App:websocket:close]`);
      addLog(`[App:websocket:close]`);
    });

    mopidy.on('state:offline', () => {
      console.log(`[App:state:offline]`);
      setState((old) => ({
        ...old,
        online: false,
        logs: SHOW_LOGS ? [`[App:state:offline]`, ...old.logs] : old.logs,
      }));
    });

    mopidy.on('state:online', async () => {
      console.log(`[App:state:online]`);
      // await showPlaybackInfo(mopidy);
      // await showTracklistInfo(mopidy);
      setState((old) => ({ ...old, online: true }));
    });

    return () => {
      console.log(`[App:destroy]`);
      addLog(`[App:destroy]`);
      mopidyRef.current = null;
      mopidy.close();
      mopidy.off();
    };
  }, []);

  return (
    <Container sx={{ p: 1, height: '100%' }}>
      <Logs logs={state.logs} />
      <AppContext.Provider value={state}>
        <Outlet />
      </AppContext.Provider>
    </Container>
  );
}
