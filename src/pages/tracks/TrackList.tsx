import { IconButton, ListItem, ListItemButton, Stack } from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { SelectableTrackSong, TrackSong } from '../../domain/track-song';
import TrackListItemText from '../../components/list/TrackListItemText';
import SongListItemAvatar from '../../components/list/SongListItemAvatar';
import { Link } from 'react-router-dom';
import { toQueryParams } from '../../lib/path-param-utils';
import { LoadingState } from '../../lib/sustain';
import LoadingList from '../../components/list/LoadingList';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import './TrackList.scss';

type TrackListParam = {
  songs: TrackSong[] | SelectableTrackSong[];
  currentSong?: TrackSong;
  onRemove?: (song: TrackSong) => void;
  onClick?: (song: TrackSong) => void;
  onSelect?: (song: SelectableTrackSong) => void;
  songCloseToLastRemoved?: TrackSong;
  menu?: ReactNode;
};

function TrackList({
  songs,
  loading,
  currentSong,
  onRemove,
  onClick,
  onSelect,
  songCloseToLastRemoved,
  menu,
}: LoadingState<TrackListParam>) {
  // console.log(`[TrackList] songCloseToLastRemoved:`, songCloseToLastRemoved);
  const shouldAutoFocus = useCallback(
    (sa: TrackSong) => {
      return sa.tlid == currentSong?.tlid || sa.tlid == songCloseToLastRemoved?.tlid;
    },
    [songCloseToLastRemoved, currentSong?.tlid]
  );

  return (
    <LoadingList className="track-list" loading={loading} length={songs.length}>
      {menu && (
        <ListItem key="TrackListItemTopMenu" className="MENU" disablePadding>
          {menu}
        </ListItem>
      )}
      {songs.map((track, index) => (
        <ListItem
          disablePadding
          key={track.tlid}
          secondaryAction={
            <Stack className="action">
              {!onSelect && (
                <IconButton
                  className="upsert-pl"
                  component={Link}
                  to={`/song-playlists-editor/${encodeURIComponent(track.uri)}?${toQueryParams(['title', encodeURIComponent(track.title)])}`}
                >
                  <img src="btn/audio-playlist-icon-70.svg" />
                </IconButton>
              )}
              {onRemove && (
                <IconButton className="del-btn" onClick={() => onRemove(track)}>
                  <img src="btn/recycle-bin-line-icon.svg" />
                </IconButton>
              )}
              {'selected' in track && track.selected && onSelect && (
                <CheckBoxOutlinedIcon onClick={() => onSelect(track)} sx={{ cursor: 'pointer' }} />
              )}
            </Stack>
          }
        >
          <ListItemButton
            autoFocus={shouldAutoFocus(track)}
            selected={track.tlid == currentSong?.tlid}
            onClick={() => (onClick ?? onSelect)?.(track)}
          >
            <SongListItemAvatar song={track} />
            <TrackListItemText track={track} index={index + 1} />
          </ListItemButton>
        </ListItem>
      ))}
      {menu && (
        <ListItem key="TrackListItemBottomMenu" className="MENU" disablePadding>
          {menu}
        </ListItem>
      )}
    </LoadingList>
  );
}

export default TrackList;
