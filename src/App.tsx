import { Container } from '@mui/material';
import Mopidy from 'mopidy';
import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Logs from './ui/Logs';
import { SHOW_LOGS } from './lib/config';
import { formatErr } from './lib/format';

export const AppContext = createContext<AppContextValue>({} as AppContextValue);

export type AppContextValue = {
  mopidy: Mopidy;
  online: boolean;
};

type AppState = {
  mopidy: Mopidy;
  online: boolean;
  logs: string[];
};

export default function App() {
  const [state, setState] = useState<AppState>({
    mopidy: new Mopidy({ webSocketUrl: '' }),
    online: false,
    logs: [],
  });

  console.log(`[App] online = ${state.online}, logs (${state.logs.length}):\n`, state.logs);

  function addLog(log: string) {
    SHOW_LOGS && setState((old) => ({ ...old, logs: [log, ...old.logs] }));
  }

  useEffect(() => {
    // console.log(`[App:useEffect] online = ${state.online}`);

    /* state.mopidy.on(
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

    state.mopidy.on('websocket:error', async (e: object | string) => {
      console.error(`[App:websocket:error]`, e);
      addLog(`[App:websocket:error] ${formatErr(e)}`);
    });

    state.mopidy.on('websocket:close', () => {
      console.warn(`[App:websocket:close]`);
      addLog(`[App:websocket:close]`);
    });

    state.mopidy.on('state:offline', () => {
      console.warn(`[App:state:offline]`);
      setState((old) => ({
        ...old,
        online: false,
        logs: SHOW_LOGS ? [`[App:state:offline]`, ...old.logs] : old.logs,
      }));
    });

    state.mopidy.on('state:online', async () => {
      console.log(`[App:state:online]`);
      setState((old) => ({ ...old, online: true }));
    });

    return () => {
      console.log(`[App:destroy]`);
      addLog(`[App:destroy]`);
      state.mopidy.off();
      state.mopidy.close();
    };
  }, [state.mopidy]);

  return (
    <Container sx={{ p: [0.5, 1], height: '100%' }}>
      <Logs logs={state.logs} />
      <AppContext.Provider value={state}>
        <Outlet />
      </AppContext.Provider>
    </Container>
  );
}
