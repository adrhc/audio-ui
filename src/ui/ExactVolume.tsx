import { Box, InputBase, IconButton, Tooltip } from '@mui/material';
import { onEnterKey } from '../lib/keys';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { FONT_SIZE } from './volume-page-styles';
// import EqualizerIcon from '@mui/icons-material/Equalizer';

export type ExactVolumeParam = {
  disabled?: boolean;
  exactVolume: number;
  setExactVolume: (v: number) => void;
  handleExactVolume: (v: number) => void;
  ys: number[];
};

const ExactVolume = ({ disabled, exactVolume, setExactVolume, handleExactVolume, ys }: ExactVolumeParam) => {
  const inputPaddingLeft = ys.map((ys) => ys * 2);
  // icon btn height = ys (i.e. ys + my)
  // icon right space = iconPaddingMyMl + iconMarginRight = ys / 2 + ys * 3 / 2 = ys * 2 = inputPaddingLeft
  const iconPaddingMyMl = ys.map((ys) => ys / 2);
  const iconMarginRight = ys.map((ys) => (ys * 3) / 2);

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
        sx={{
          '& .MuiInputBase-input': {
            fontSize: FONT_SIZE.input,
            fontWeight: 'bold',
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
              p: iconPaddingMyMl,
              my: iconPaddingMyMl,
              ml: iconPaddingMyMl,
              mr: iconMarginRight,
            }}
            onClick={() => handleExactVolume(exactVolume)}
          >
            <GraphicEqIcon sx={{ fontSize: FONT_SIZE.icon }} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ExactVolume;
