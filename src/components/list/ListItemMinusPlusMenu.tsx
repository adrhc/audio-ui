import { ButtonGroup, Button } from '@mui/material';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { NoArgsProc } from '../../domain/types';

interface ListItemMinusPlusMenuProps {
  onMinus: NoArgsProc;
  onPlus: NoArgsProc;
}

function ListItemMinusPlusMenu({ onMinus, onPlus }: ListItemMinusPlusMenuProps) {
  return (
    <ButtonGroup>
      <Button variant="outlined" onClick={onMinus}>
        <CheckBoxOutlineBlankOutlinedIcon />
      </Button>
      <Button variant="outlined" onClick={onPlus}>
        <CheckBoxOutlinedIcon />
      </Button>
    </ButtonGroup>
  );
}

export default ListItemMinusPlusMenu;
