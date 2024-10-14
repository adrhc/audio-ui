import { Navigate, createHashRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import TrackListPage from './components/list/TrackListPage';
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
import LocalLibraryToPlaySelectorPage from './pages/local-playlists/LocalLibraryToPlaySelectorPage';
import LocalPlaylistItemToPlaySelectorPage from './pages/local-playlists/LocalPlaylistItemToPlaySelectorPage';
import PlaylistToSongAllocatorPage from './pages/pl-editor/PlaylistToSongAllocatorPage';
import AddPlaylistPage from './pages/AddPlaylistPage';
import AddTrackPage from './pages/AddTrackPage';
import AdminMenuPage from './pages/AdminMenuPage';
import LocalLibraryEditorPage from './pages/pl-editor/LocalLibraryEditorPage';
import CurrentPlayToPlaylistAllocatorPage from './pages/pl-editor/CurrentPlayToPlaylistAllocatorPage';

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
        element: <PlaylistToSongAllocatorPage />,
      },
      {
        path: 'local-playlist-content/:uri',
        element: <LocalPlaylistItemToPlaySelectorPage />,
      },
      {
        path: 'local-playlists',
        element: <LocalLibraryToPlaySelectorPage />,
      },
      {
        path: 'playlist-edit-options',
        element: <LocalLibraryEditorPage />,
      },
      {
        path: 'playlist-edit-from-current-play/:uri',
        element: <CurrentPlayToPlaylistAllocatorPage />,
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
