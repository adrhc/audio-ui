import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { EEPreset, isPositiveFloor } from '../../infrastructure/easyeffects';
import './PresetViewPanel.scss';
import ShowIf from '../ShowIf';

const PresetViewPanel = ({ preset }: { preset: EEPreset }) => {
  return (
    <Table className="preset-view">
      <TableBody>
        <TableRow>
          <TableCell>Amount:</TableCell>
          <TableCell>{preset.amount}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Blend:</TableCell>
          <TableCell>{preset.blend}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Harmonics:</TableCell>
          <TableCell>{preset.harmonics}</TableCell>
        </TableRow>
        {isPositiveFloor(preset) && (
          <TableRow>
            <TableCell>Frequencies:</TableCell>
            <TableCell>
              {preset.floor}Hz - {preset.scope}Hz
            </TableCell>
          </TableRow>
        )}
        <ShowIf condition={!isPositiveFloor(preset)}>
          <TableRow>
            <TableCell>Max Frequency:</TableCell>
            <TableCell>{preset.scope}Hz</TableCell>
          </TableRow>
        </ShowIf>
      </TableBody>
    </Table>
  );
};

export default PresetViewPanel;
