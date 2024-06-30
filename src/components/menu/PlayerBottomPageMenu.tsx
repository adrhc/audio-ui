import { IconButton, Stack } from '@mui/material';
import { isAdrhc } from '../../lib/adrhc';
import ShowIf from '../ShowIf';
import CornerIconButton from '../button/cornerbutton/CornerIconButton';
import { Link } from 'react-router-dom';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import kefctrl from '../../assets/kef-control-no-bkg.png';
import './PlayerBottomPageMenu.scss';

function PlayerBottomPageMenu() {
  return (
    <Stack className="player-button-group-menu" direction="row">
      <ShowIf condition={isAdrhc()} otherwise={<div></div>}>
        <CornerIconButton to="/easyeffects">
          <img src="easyeffects.svg" />
        </CornerIconButton>
      </ShowIf>
      <IconButton className="center" component={Link} to="/menu">
        <BlurCircularIcon />
      </IconButton>
      <ShowIf condition={isAdrhc()} otherwise={<div></div>}>
        <CornerIconButton to="/keflsx" position="right">
          <img src={kefctrl} />
        </CornerIconButton>
      </ShowIf>
    </Stack>
  );
}

export default PlayerBottomPageMenu;
