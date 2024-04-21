import { Icon, ToggleButton } from '@mui/material';
import { NoArgsProc, Styles } from '../../lib/types';
import { toArray } from '../../lib/array';

type TogglePngButtonParam = {
  sx?: Styles;
  iconSx?: Styles;
  offImg: string;
  onImg: string;
  selected?: boolean | null;
  onClick: NoArgsProc;
};

const ToggleImgButton = ({ sx, iconSx, offImg, onImg, selected, onClick }: TogglePngButtonParam) => {
  return (
    <ToggleButton value={`${offImg}-${onImg}`} sx={[{ lineHeight: 0 }, ...toArray(sx)]} onClick={onClick}>
      <Icon sx={iconSx}>
        <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={selected ? onImg : offImg} />
      </Icon>
    </ToggleButton>
  );
};

export default ToggleImgButton;
