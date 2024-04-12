import { Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SubjectIcon from '@mui/icons-material/Subject';
import TuneIcon from '@mui/icons-material/Tune';
import { BORDER, playIconFontSizeMap } from './VolumePage-styles';
import { NoArgsProc, Styles } from '../lib/types';
import { useSpaceEvenly } from '../lib/hooks';

type PrevNextPanelParam = {
  disabled: boolean;
  previous: NoArgsProc;
  next: NoArgsProc;
  toggleTune: NoArgsProc;
};

const SX: Record<string, Styles> = {
  btn: {
    color: 'black',
  },
  tk: {
    fontSize: playIconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.75 + (i == 0 ? -0.35 : -0.1))),
  },
  bf: {
    fontSize: playIconFontSizeMap((ifs) => ifs.map((n, i) => n + 1.1 + (i == 0 ? 1 : 0.75))),
  },
  tune: {
    fontSize: playIconFontSizeMap((ifs) => ifs.map((n, i) => n + 0.75 + (i == 0 ? -0.35 : -0.1))),
  },
};

export default function PrevNextPanel({ disabled, previous, next, toggleTune }: PrevNextPanelParam) {
  const justifyContent = useSpaceEvenly();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent, ...BORDER }}>
      <IconButton disabled={disabled} sx={SX.btn} component={Link} to="/trackList">
        <SubjectIcon sx={SX.tk} />
      </IconButton>
      <IconButton disabled={disabled} sx={{ ...SX.btn, p: 0 }} onClick={() => previous()}>
        <NavigateBeforeIcon sx={SX.bf} />
      </IconButton>
      <IconButton disabled={disabled} sx={{ ...SX.btn, p: 0 }} onClick={() => next()}>
        <NavigateNextIcon sx={SX.bf} />
      </IconButton>
      <IconButton disabled={disabled} sx={SX.btn} onClick={toggleTune}>
        <TuneIcon sx={SX.tune} />
      </IconButton>
    </Box>
  );
}
