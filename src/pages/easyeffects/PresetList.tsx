import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import EditIconButton from '../../components/button/EditIconButton';
import LoadingList from '../../components/list/LoadingList';
import { LoadingState } from '../../lib/sustain';
import './PresetList.scss';

type PresetsListState = {
  current?: string;
  presets: string[];
  onView: (preset: string) => void;
  onEdit: (preset: string) => void;
  onDelete: (preset: string) => void;
  onSelection: (preset: string) => void;
};

const PresetList = ({
  current,
  presets,
  loading,
  onView,
  onEdit,
  onDelete,
  onSelection,
}: LoadingState<PresetsListState>) => {
  return (
    <LoadingList className="preset-list" length={presets.length} loading={loading}>
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
    </LoadingList>
  );
};

export default PresetList;
