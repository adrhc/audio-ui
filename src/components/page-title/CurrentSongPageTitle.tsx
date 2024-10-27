import { Badge, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../hooks/AppContext';
import SurroundSoundIcon from '@mui/icons-material/SurroundSound';
import PageTitle from './PageTitle';

export default function CurrentSongPageTitle() {
  const { currentSong, streamTitle, boost } = useContext(AppContext);

  return (
    <>
      {currentSong?.tlid && (
        <Box className="ignored">
          <PageTitle>
            <Badge color={boost < 0 ? 'warning' : 'info'} badgeContent={boost} invisible={boost == 0}>
              <Link to="/audio-boost">
                <SurroundSoundIcon />
              </Link>
            </Badge>
            &nbsp;{currentSong?.title}
          </PageTitle>
          <PageTitle>{streamTitle ?? currentSong?.artists}</PageTitle>
        </Box>
      )}
    </>
  );
}
