import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { shallowDiskUpdate as indexShallowDiskUpdate } from '../services/audio-db/audio-db';
import PageTemplate from '../templates/PageTemplate';
import HomeIcon from '@mui/icons-material/Home';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { useCallback, useContext } from 'react';
import { AppContext } from '../components/app/AppContext';
import { useGoBack } from '../hooks/useGoBack';
import { useSustainableUnknownState } from '../hooks/useSustainableState';
import { Link } from 'react-router-dom';
import BackwardIcon from '../components/BackwardIcon';
import '../styles/menu-page.scss';

export default function AdminMenuPage() {
  const goBackFn = useGoBack();
  const { credentials, reloadState, setNotification } = useContext(AppContext);
  const [state, sustain, setState] = useSustainableUnknownState();

  /* todo: update the reset method to touch only the DISK entries!
  const reset = useCallback(() => {
    sustain(
      indexReset().then(() => setNotification('The index was reset!')),
      'Failed to reset the index!'
    );
  }, [setNotification, sustain]); */

  const shallowDiskUpdate = useCallback(() => {
    sustain(
      indexShallowDiskUpdate().then(() => setNotification('The disk entries were synced with the index!')),
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
            <SettingsBackupRestoreIcon />
          </ListItemIcon>
          <ListItemText>Reset The Index</ListItemText>
        </MenuItem> */}
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
        {/* <Divider /> */}
        <MenuItem onClick={goBackFn}>
          <ListItemIcon>
            <BackwardIcon />
          </ListItemIcon>
          <ListItemText>Back</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/player">
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
