import { ListItem, IconButton, ListItemButton, ListItemText } from '@mui/material';
import EditIconButton from '../../components/button/EditIconButton';
import LoadingList from '../../components/list/LoadingList';
import { LoadingState } from '../../lib/sustain/types';

type CRUDListState = {
  current?: string;
  elements: string[];
  onView: (preset: string) => void;
  onEdit: (preset: string) => void;
  onDelete?: (preset: string) => void;
  onSelection?: (preset: string) => void;
};

export default function CRUDList({
  loading,
  current,
  elements,
  onView,
  onEdit,
  onDelete,
  onSelection,
}: LoadingState<CRUDListState>) {
  return (
    <LoadingList
      className={`${onDelete ? '' : 'no-del-btn'} crud-list`}
      length={elements.length}
      loading={loading}
    >
      {elements.map((it) => (
        <ListItem
          disablePadding
          key={it}
          secondaryAction={
            <>
              <IconButton className="view-btn" onClick={() => onView(it)}>
                <img src="btn/magnifying-glass-icon.svg" />
              </IconButton>
              <EditIconButton className="edit-btn" outline={true} onClick={() => onEdit(it)} />
              {onDelete && (
                <IconButton className="del-btn" onClick={() => onDelete(it)}>
                  <img src="btn/recycle-bin-line-icon.svg" />
                </IconButton>
              )}
            </>
          }
        >
          <ListItemButton
            autoFocus={it == current}
            selected={it == current}
            onClick={() => (onSelection ? onSelection(it) : undefined)}
          >
            <ListItemText sx={{ wordBreak: 'break-word' }} primary={it} />
          </ListItemButton>
        </ListItem>
      ))}
    </LoadingList>
  );
}
