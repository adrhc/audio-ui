import { Button, ButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SubjectIcon from '@mui/icons-material/Subject';
import TuneIcon from '@mui/icons-material/Tune';
import { iconFontSize } from '../../pages/styles';
import { NoArgsProc, Styles } from '../../domain/types';
import './PrevNextPanel.scss';

type PrevNextPanelParam = {
  sx?: Styles;
  disabled?: boolean;
  previous: NoArgsProc;
  next: NoArgsProc;
  toggleTune: NoArgsProc;
};

// const btnStyle: Styles = { color: 'black', p: 0.75 };
/* const tkStyle: Styles = {
  fontSize: playIconFontSize((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.4 : 0.65))),
};
const bfStyle: Styles = {
  fontSize: playIconFontSize((ifs) => ifs.map((n, i) => n + (i == 0 ? 2.1 : 1.85))),
};
const tuneStyle: Styles = {
  fontSize: playIconFontSize((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.4 : 0.65))),
}; */

export default function PrevNextPanel({
  disabled = false,
  previous,
  next,
  toggleTune,
  sx,
}: PrevNextPanelParam) {
  const fontSize = iconFontSize(fs => fs.map(n => n + 1));
  return (
    <ButtonGroup className="prev-next-panel" disabled={disabled} sx={sx}>
      <Button variant="outlined" component={Link} to="/trackList">
        <SubjectIcon sx={{ fontSize }} />
      </Button>
      <Button variant="outlined" onClick={() => previous()}>
        <NavigateBeforeIcon sx={{ fontSize }} />
      </Button>
      <Button variant="outlined" onClick={() => next()}>
        <NavigateNextIcon sx={{ fontSize }} />
      </Button>
      <Button variant="outlined" onClick={toggleTune}>
        <TuneIcon sx={{ fontSize }} />
      </Button>
    </ButtonGroup>
  );
}
