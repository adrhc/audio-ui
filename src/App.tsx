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

function App() {
  const mopidyRef = useRef<Mopidy | null>(null);

  const [logs, setLogs] = useState<string[]>([]);
  const [online, setOnline] = useState(false);
  console.log(`[App] mopidyRef = ${!!mopidyRef.current}, online = ${online}, logs (${logs.length}):`, logs);

  function addLog(log: string) {
    SHOW_LOGS && setLogs((oldLog) => [log, ...oldLog]);
  }

  useEffect(() => {
    const mopidy = (mopidyRef.current = new Mopidy({ webSocketUrl: '' }));
    console.log(`[App:useEffect] mopidyRef = true, online = ${online}`);

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
      addLog(`[App:state:offline]`);
      setOnline(false);
    });

    mopidy.on('state:online', async () => {
      console.log(`[App:state:online]`);
      // await showPlaybackInfo(mopidy);
      // await showTracklistInfo(mopidy);
      setOnline(true);
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
    <Container sx={{ pt: 1, pb: 1, height: '100%' }}>
      <Logs logs={logs} />
      <AppContext.Provider value={{ online, mopidyRef }}>
        <Outlet />
      </AppContext.Provider>
    </Container>
  );
}

export default App;
