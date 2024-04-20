import { IconButton, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SubjectIcon from '@mui/icons-material/Subject';
import TuneIcon from '@mui/icons-material/Tune';
import { playIconFontSizeMap } from '../../pages/volume/styles';
import { NoArgsProc, Styles } from '../../lib/types';

type PrevNextPanelParam = {
  disabled?: boolean;
  previous: NoArgsProc;
  next: NoArgsProc;
  toggleTune: NoArgsProc;
};

const btnStyle: Styles = { color: 'black', p: 0.75 };
const tkStyle: Styles = {
  fontSize: playIconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.4 : 0.65))),
};
const bfStyle: Styles = {
  fontSize: playIconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 2.1 : 1.85))),
};
const tuneStyle: Styles = {
  fontSize: playIconFontSizeMap((ifs) => ifs.map((n, i) => n + (i == 0 ? 0.4 : 0.65))),
};

export default function PrevNextPanel({ disabled, previous, next, toggleTune }: PrevNextPanelParam) {
  return (
    <Stack direction="row" className="panel">
      <IconButton disabled={disabled} sx={btnStyle} component={Link} to="/trackList">
        <SubjectIcon sx={tkStyle} />
      </IconButton>
      <IconButton disabled={disabled} sx={{ ...btnStyle, p: 0 }} onClick={() => previous()}>
        <NavigateBeforeIcon sx={bfStyle} />
      </IconButton>
      <IconButton disabled={disabled} sx={{ ...btnStyle, p: 0 }} onClick={() => next()}>
        <NavigateNextIcon sx={bfStyle} />
      </IconButton>
      <IconButton disabled={disabled} sx={btnStyle} onClick={toggleTune}>
        <TuneIcon sx={tuneStyle} />
      </IconButton>
    </Stack>
  );
}
