import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { LocationSelection, MediaLocation } from '../../domain/media-location';
import LoadingList from './LoadingList';
import { LoadingState } from '../../lib/sustain/types';
import './LocationSelectionList.scss';

interface LocationsSelectionListParam {
  selections: LocationSelection[];
  onClick: (ml: MediaLocation) => void;
}

function LocationSelectionList({
  selections: playlists,
  loading,
  onClick,
}: LoadingState<LocationsSelectionListParam>) {
  return (
    <LoadingList className="location-list" length={playlists.length} loading={loading}>
      {playlists.map((ml, index) => (
        <ListItem
          disablePadding
          className={ml.type}
          key={ml.uri}
          secondaryAction={ml.selected && <CheckBoxOutlinedIcon onClick={() => onClick(ml)} />}
        >
          <ListItemButton onClick={() => onClick(ml)} sx={{ py: 0 }}>
            <ListItemText
              primary={`${index + 1}. ${ml.title}`}
              secondary={ml.formattedUri}
              sx={{ wordBreak: 'break-all', my: 0.5 }}
              primaryTypographyProps={{ fontSize: ['1.1rem', '0.95rem'] }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </LoadingList>
  );
}

export default LocationSelectionList;
