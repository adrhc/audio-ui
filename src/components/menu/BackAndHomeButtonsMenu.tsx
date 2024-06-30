import { Button } from '@mui/material';
import BackButtonMenu, { BackButtonMenuParam } from './BackButtonMenu';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

function BackAndHomeButtonsMenu({ goBack, children }: BackButtonMenuParam) {
  return (
    <BackButtonMenu goBack={goBack}>
      {children}
      <Button variant="outlined" component={Link} to="/player">
        <HomeIcon />
      </Button>
    </BackButtonMenu>
  );
}

export default BackAndHomeButtonsMenu;
