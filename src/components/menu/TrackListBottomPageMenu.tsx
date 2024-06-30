import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCallback, useContext } from 'react';
import { AppContext } from '../app/AppContext';
import { clearTrackList as clearMopidyTrackList } from '../../services/mpc';
import { SustainVoidFn } from '../../hooks/useSustainableState';
import { TrackSong } from '../../domain/track-song';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BackButtonMenu from './BackButtonMenu';
import SurroundSoundIcon from '@mui/icons-material/SurroundSound';
import AddIcon from '@mui/icons-material/Add';

interface TrackListMenuState {
  songs: TrackSong[];
}

type TrackListMenuParam = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sustain: SustainVoidFn<TrackListMenuState>;
};

function TrackListMenu({ sustain }: TrackListMenuParam) {
  const { mopidy, online } = useContext(AppContext);
  const clearTrackList = useCallback(() => {
    sustain(
      clearMopidyTrackList(mopidy).then(() => ({ songs: [] })),
      'Failed to clear the track list!',
      true
    );
  }, [mopidy, sustain]);
  return (
    <BackButtonMenu>
      <Button variant="outlined" component={Link} to="/audio-boost">
        <SurroundSoundIcon />
      </Button>
      <Button variant="outlined" component={Link} to="/add-track">
        <AddIcon />
      </Button>
      <Button disabled={!online} variant="outlined" onClick={clearTrackList}>
        <DeleteOutlineOutlinedIcon />
      </Button>
    </BackButtonMenu>
  );
}

export default TrackListMenu;
