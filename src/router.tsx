import { Dashboard } from "@mui/icons-material";
import { createHashRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import TrackListPage from "./pages/tracklist/TrackListPage";
import PlayerPage from "./pages/player/PlayerPage";
import KefLsxPage from "./pages/keflsx/KefLsxPage";

const ROUTER = createHashRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: <Dashboard />,
        },
        {
          path: 'trackList',
          element: <TrackListPage />,
        },
        {
          path: 'volume',
          element: <PlayerPage />,
        },
        {
          path: 'keflsx',
          element: <KefLsxPage />,
        },
      ],
    },
  ]);
  
  export default ROUTER;