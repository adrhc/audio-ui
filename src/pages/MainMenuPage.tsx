import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import PageTemplate from '../templates/PageTemplate';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useSustainableUnknownState } from '../hooks/useSustainableState';
import { useContext } from 'react';
import { AppContext } from '../hooks/AppContext';
import './MainMenuPage.scss';

function MainMenuPage() {
  const { credentials } = useContext(AppContext);
  const [state, , setState] = useSustainableUnknownState();

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
        <MenuItem component={Link} to="/admin">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>Administration</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/login">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>Login</ListItemText>
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
        <MenuItem component={Link} to="/local-playlists">
          <ListItemIcon>
            {/* <img src="mopidy.png" className="local-playlists" /> */}
            <SaveOutlinedIcon className="local-playlists" />
          </ListItemIcon>
          <ListItemText>Local Playlists</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/playlist-edit-options">
          <ListItemIcon>
            <img src="btn/audio-playlist-icon-70.svg" className="playlist-edit-options" />
          </ListItemIcon>
          <ListItemText>Playlist Editor</ListItemText>
        </MenuItem>
        {/* <Divider /> */}
        <MenuItem component={Link} to="/player">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>
      </MenuList>
    </PageTemplate>
  );
}

export default MainMenuPage;
