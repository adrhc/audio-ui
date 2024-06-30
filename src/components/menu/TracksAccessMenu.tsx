import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SubjectIcon from '@mui/icons-material/Subject';
import SurroundSoundIcon from '@mui/icons-material/SurroundSound';
import BackAndHomeButtonsMenu from './BackAndHomeButtonsMenu';

function TracksAccessMenu() {
  return (
    <BackAndHomeButtonsMenu>
      <Button variant="outlined" component={Link} to="/trackList">
        <SubjectIcon />
      </Button>
      <Button variant="outlined" component={Link} to="/audio-boost">
        <SurroundSoundIcon />
      </Button>
    </BackAndHomeButtonsMenu>
  );
}

export default TracksAccessMenu;
