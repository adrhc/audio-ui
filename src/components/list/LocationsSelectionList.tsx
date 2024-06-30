import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { LocationSelection, MediaLocation } from '../../domain/media-location';
import '/src/styles/list/list.scss';

interface LocationsSelectionListParam {
  selections: LocationSelection[];
  onClick: (pl: MediaLocation) => void;
}

function LocationsSelectionList({ selections: playlists, onClick }: LocationsSelectionListParam) {
  return (
    <List className="list playlists-list" sx={{ '.MuiListItemSecondaryAction-root': { lineHeight: 0 } }}>
      {playlists.map((pl, index) => (
        <ListItem
          disablePadding
          className={pl.type}
          key={pl.title}
          secondaryAction={
            pl.selected && <CheckBoxOutlinedIcon onClick={() => onClick(pl)} sx={{ cursor: 'pointer' }} />
          }
        >
          <ListItemButton onClick={() => onClick(pl)} sx={{ py: 0 }}>
            <ListItemText
              primary={`${index + 1}. ${pl.title}`}
              secondary={pl.formattedUri}
              sx={{ wordBreak: 'break-all', my: 0.5 }}
              primaryTypographyProps={{ fontSize: ['1.1rem', '0.95rem'] }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default LocationsSelectionList;
