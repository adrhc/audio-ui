import { Icon, ToggleButton } from '@mui/material';
import { NoArgsProc, Styles } from '../../domain/types';
import { toArray } from '../../lib/array';

type ToggleImgButtonParam = {
  className?: string;
  sx?: Styles;
  iconSx?: Styles;
  offImg: string;
  onImg: string;
  selected?: boolean | null;
  onClick: NoArgsProc;
};

const ToggleImgButton = ({
  className,
  sx,
  iconSx,
  offImg,
  onImg,
  selected,
  onClick,
}: ToggleImgButtonParam) => {
  return (
    <ToggleButton
      className={className}
      value={`${offImg}-${onImg}`}
      sx={[{ lineHeight: 0 }, ...toArray(sx)]}
      onClick={onClick}
    >
      <Icon sx={iconSx}>
        <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={selected ? onImg : offImg} />
      </Icon>
    </ToggleButton>
  );
};

export default ToggleImgButton;
