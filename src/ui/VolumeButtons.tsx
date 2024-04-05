import { ButtonGroup, Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export type VolumeButtonsParam = {
    disabled?: boolean;
    volume: number;
    handleExactVolume: (v: number) => void;
    // btnStyle: {[key: string]: number | string | number[] | string[]};
    btnStyle: Record<string, number | string | number[] | string[]>;
};

const VolumeButtons = ({ disabled, volume, handleExactVolume, btnStyle }: VolumeButtonsParam) => {
    return ( 
        <ButtonGroup>
          <Button
            disabled={disabled}
            variant="outlined"
            size="large"
            sx={{ ...btnStyle, flexGrow: 1 }}
            onClick={() => handleExactVolume(volume - 1)}
          >
            <RemoveCircleIcon />
          </Button>
          {/* <Chip label={volume} sx={{px: 0.5, mx: 1}}/> */}
          <Button
            disabled={disabled}
            variant="outlined"
            size="large"
            sx={{ ...btnStyle, flexGrow: 1 }}
            onClick={() => handleExactVolume(volume + 1)}
          >
            <AddCircleIcon />
          </Button>
        </ButtonGroup>
     );
}
 
export default VolumeButtons;