import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import EditIconButton from '../../components/button/EditIconButton';
import { Styles } from '../../domain/types';
import '/src/styles/list/list.scss';
import './PresetsList.scss';

type PresetsListState = {
  sx?: Styles;
  current?: string;
  presets: string[];
  onView: (preset: string) => void;
  onEdit: (preset: string) => void;
  onDelete: (preset: string) => void;
  onSelection: (preset: string) => void;
};

const PresetsList = ({ sx, current, presets, onView, onEdit, onDelete, onSelection }: PresetsListState) => {
  return (
    <List className="list presets-list" sx={sx}>
      {presets.map((it) => (
        <ListItem
          disablePadding
          key={it}
          secondaryAction={
            <>
              <IconButton className="view-btn" onClick={() => onView(it)}>
                <img src="btn/magnifying-glass-icon.svg" />
              </IconButton>
              <EditIconButton className="edit-btn" outline={true} onClick={() => onEdit(it)} />
              <IconButton className="del-btn" onClick={() => onDelete(it)}>
                <img src="btn/recycle-bin-line-icon.svg" />
              </IconButton>
            </>
          }
        >
          <ListItemButton autoFocus={it == current} selected={it == current} onClick={() => onSelection(it)}>
            <ListItemText sx={{ wordBreak: 'break-word' }} primary={it} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default PresetsList;
