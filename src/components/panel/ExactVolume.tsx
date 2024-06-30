import { Box, InputBase, IconButton, Tooltip } from '@mui/material';
import { onEnterKey } from '../../lib/keyboard';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { iconFontSize, inputFontSize, panelYSpace } from '../../pages/styles';
import { useBreakpointValue } from '../../hooks/useBreakpointValue';
// import EqualizerIcon from '@mui/icons-material/Equalizer';

export type ExactVolumeParam = {
  disabled?: boolean;
  exactVolume: number;
  setExactVolume: (v: number) => void;
  handleExactVolume: (v: number) => void;
};

const ExactVolume = ({ disabled, exactVolume, setExactVolume, handleExactVolume }: ExactVolumeParam) => {
  const xFactor = useBreakpointValue(0.5, 2);
  // console.log('xFactor:', xFactor)
  // ExactVolume height is ys, see '& .MuiInputBase-input'.py
  const inputPaddingLeft = panelYSpace(it => it.map((ys) => ys * xFactor));
  // icon right space = iconPaddingMy + iconMarginRight = inputPaddingLeft
  const iconPaddingMy = panelYSpace(it => it.map((ys) => (ys * xFactor) / 4));
  const iconMarginRight = panelYSpace(it => it.map((ys) => (3 * ys * xFactor) / 4));

  return (
    <Box className="panel">
      <InputBase
        fullWidth
        disabled={disabled}
        type="number"
        value={exactVolume}
        onChange={(e) => setExactVolume(+e.target.value)}
        onKeyUp={(e) => onEnterKey(() => handleExactVolume(exactVolume), e)}
        sx={{
          fontSize: inputFontSize(),
          fontWeight: 'bold',
          '& .MuiInputBase-input': {
            pl: inputPaddingLeft,
          },
        }}
        inputProps={{ min: 0, max: 100 }}
      />
      <Tooltip title={`Set the volume to ${exactVolume}`}>
        <span>
          <IconButton
            disabled={disabled}
            type="button"
            sx={{
              color: '#1976d2',
              p: iconPaddingMy,
              ml: '1px',
              mr: iconMarginRight,
              my: iconPaddingMy,
            }}
            onClick={() => handleExactVolume(exactVolume)}
          >
            <GraphicEqIcon sx={{ fontSize: iconFontSize() }} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ExactVolume;
