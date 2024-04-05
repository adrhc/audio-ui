import { Box, InputBase, IconButton, Tooltip } from '@mui/material';
import { onEnterKey } from '../lib/keys';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { Styles } from '../lib/types';
// import EqualizerIcon from '@mui/icons-material/Equalizer';
import * as CSS from 'csstype';

export type ExactVolumeParam = {
  disabled?: boolean;
  exactVolume: number;
  setExactVolume: (v: number) => void;
  handleExactVolume: (v: number) => void;
  inputStyle?: CSS.PropertiesFallback<number | string>;
  iconStyle: Styles;
};

const ExactVolume = ({
  disabled,
  exactVolume,
  setExactVolume,
  handleExactVolume,
  inputStyle,
  iconStyle,
}: ExactVolumeParam) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        border: 'solid thin rgba(0, 0, 0, 0.2)',
        borderRadius: 1,
      }}
    >
      <InputBase
        fullWidth
        disabled={disabled}
        type="number"
        value={exactVolume}
        onChange={(e) => setExactVolume(+e.target.value)}
        onKeyUp={(e) => onEnterKey(() => handleExactVolume(exactVolume), e)}
        sx={{ '& .MuiInputBase-input': { fontWeight: 'bold', ...inputStyle } }}
        inputProps={{ min: 0, max: 100 }}
      />
      <Tooltip title={`Set the volume to ${exactVolume}.`}>
        <span>
          <IconButton
            disabled={disabled}
            type="button"
            sx={{ color: '#1976d2', ...iconStyle }}
            onClick={() => handleExactVolume(exactVolume)}
          >
            <GraphicEqIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ExactVolume;
