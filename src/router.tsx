import { Navigate, createHashRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import TrackListPage from './pages/tracks/TrackListPage';
import PlayerPage from './pages/PlayerPage';
import KefLsxPage from './pages/KefLsxPage';
import EasyEffectsPage from './pages/easyeffects/EasyEffectsPage';
import PresetEditPage from './pages/easyeffects/PresetEditPage';
import PresetViewPage from './pages/easyeffects/PresetViewPage';
import PresetDeletePage from './pages/easyeffects/PresetDeletePage';
import AudioBoostPage from './pages/AudioBoostPage';
import MainMenuPage from './pages/MainMenuPage';
import SongSearchPage from './pages/songssearch/SongSearchPage';
import PlaybackHistoryPage from './pages/history/PlaybackHistoryPage';
import LoginPage from './pages/login/LoginPage';
import YouTubePlContentPage from './pages/ytmlibrary/YouTubePlContentPage';
import YTMusicLibraryPage from './pages/ytmlibrary/YTMusicLibraryPage';
import LocalPlaylistsPage from './pages/local-playlists/LocalPlaylistsPage';
import LocalPlContentPage from './pages/local-playlists/LocalPlContentPage';
import PlaylistToEditSelectorPage from './pages/pl-editor/PlaylistToEditSelectorPage';
import AddPlaylistPage from './pages/AddPlaylistPage';
import AddTrackPage from './pages/AddTrackPage';
import AdminMenuPage from './pages/AdminMenuPage';
import PlaylistEditorPage from './pages/pl-editor/PlaylistEditorPage';
import PlEditFromCurrentPlayPage from './pages/pl-editor/PlEditFromCurrentPlayPage';

const ROUTER = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Navigate to="player" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'add-track',
        element: <AddTrackPage />,
      },
      {
        path: 'add-playlist',
        element: <AddPlaylistPage />,
      },
      {
        path: 'song-playlists-editor/:uri',
        element: <PlaylistToEditSelectorPage />,
      },
      {
        path: 'local-playlist-content/:uri',
        element: <LocalPlContentPage />,
      },
      {
        path: 'local-playlists',
        element: <LocalPlaylistsPage />,
      },
      {
        path: 'playlist-edit-options',
        element: <PlaylistEditorPage />,
      },
      {
        path: 'playlist-edit-from-current-play/:uri',
        element: <PlEditFromCurrentPlayPage />,
      },
      {
        path: 'ytplcontent/:uri',
        element: <YouTubePlContentPage />,
      },
      {
        path: 'ytmlibrary',
        element: <YTMusicLibraryPage />,
      },
      {
        path: 'trackList',
        element: <TrackListPage />,
      },
      {
        path: 'player',
        element: <PlayerPage />,
      },
      {
        path: 'keflsx',
        element: <KefLsxPage />,
      },
      {
        path: 'audio-boost',
        element: <AudioBoostPage />,
      },
      {
        path: 'easyeffects',
        element: <EasyEffectsPage />,
      },
      {
        path: 'songssearch',
        element: <SongSearchPage />,
      },
      {
        path: 'history',
        element: <PlaybackHistoryPage />,
      },
      {
        path: 'menu',
        element: <MainMenuPage />,
      },
      {
        path: 'admin',
        element: <AdminMenuPage />,
      },
      {
        path: 'easyeffects/:preset',
        element: <PresetEditPage />,
      },
      {
        path: 'easyeffects/view/:preset',
        element: <PresetViewPage />,
      },
      {
        path: 'easyeffects/delete/:preset',
        element: <PresetDeletePage />,
      },
    ],
  },
]);

export default ROUTER;
