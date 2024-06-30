import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useGoBack } from '../hooks/useGoBack';
import { Link } from 'react-router-dom';
import PageTemplate from '../templates/PageTemplate';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { shallowDiskUpdate as shallowDiskUpdateImpl } from '../services/audio-db/audio-db';
import { useSustainableUnknownState } from '../hooks/useSustainableState';
import { useCallback, useContext } from 'react';
import { AppContext } from '../components/app/AppContext';
import './MenuPage.scss';

function MenuPage() {
  const goBackFn = useGoBack();
  const { credentials, reloadState, setNotification } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableUnknownState();

  /* const reset = useCallback(() => {
    sustain(
      indexReset().then(() => setNotification('The index was reset!')),
      'Failed to reset the index!'
    );
  }, [setNotification, sustain]); */

  const shallowDiskUpdate = useCallback(() => {
    sustain(
      shallowDiskUpdateImpl().then(() => setNotification('The disk entries were synced with the index!')),
      'Failed to sync the index with the disk entries!'
    );
  }, [setNotification, sustain]);

  return (
    <PageTemplate
      className="menu-page"
      state={state}
      setState={setState}
      title={credentials.user ? `Logged with ${credentials.user}` : undefined}
      bottom={<div />}
    >
      <MenuList>
        {/* <MenuItem onClick={reset}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>Reset The Index</ListItemText>
        </MenuItem> */}
        <MenuItem component={Link} to="/login">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>Login</ListItemText>
        </MenuItem>
        <MenuItem onClick={shallowDiskUpdate}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>Update The Disk Entries</ListItemText>
        </MenuItem>
        <MenuItem onClick={reloadState}>
          <ListItemIcon>
            <CachedOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Reload The State</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/songssearch">
          <ListItemIcon>
            <img className="search" src="btn/find-icon.svg" />
          </ListItemIcon>
          <ListItemText>Search Songs</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/history">
          <ListItemIcon>
            <HistoryOutlinedIcon className="history" />
          </ListItemIcon>
          <ListItemText>Playback History</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/ytmlibrary">
          <ListItemIcon>
            <YouTubeIcon className="ytmlibrary" />
          </ListItemIcon>
          <ListItemText>YouTube Playlists</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/mopidy-playlists">
          <ListItemIcon>
            <img src="mopidy.png" className="mopidy-playlists" />
          </ListItemIcon>
          <ListItemText>Mopidy Playlists</ListItemText>
        </MenuItem>
        {/* <Divider /> */}
        <MenuItem onClick={goBackFn}>
          <ListItemIcon>
            <HomeIcon />
            {/* <img className="search" src="btn/angle-circle-arrow-left-icon.svg" /> */}
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>
      </MenuList>
    </PageTemplate>
  );
}

export default MenuPage;
