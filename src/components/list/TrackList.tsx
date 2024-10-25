import { IconButton, ListItem, ListItemButton, Stack } from '@mui/material';
import { ReactNode, useCallback, useContext } from 'react';
import { SelectableTrack, Track } from '../../domain/track';
import TrackListItemText from './TrackListItemText';
import SongListItemAvatar from './SongListItemAvatar';
import { Link } from 'react-router-dom';
import { toQueryParams } from '../../lib/url-search-params';
import { LoadingState } from '../../lib/sustain';
import LoadingList from './LoadingList';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ScrollableList from '../../domain/scroll';
import { AppContext } from '../../hooks/AppContext';
import './TrackList.scss';

interface TrackListParam extends ScrollableList {
  songs: SelectableTrack[];
  onRemove?: (song: Track) => void;
  onClick?: (song: Track) => void;
  onSelect?: (song: SelectableTrack) => void;
  songCloseToLastRemoved?: Track;
  menu?: ReactNode;
  className?: string;
}

function TrackList({
  songs,
  loading,
  onRemove,
  onClick,
  onSelect,
  songCloseToLastRemoved,
  menu,
  className,
  listRef,
  onScroll,
}: LoadingState<TrackListParam>) {
  // console.log(`[TrackList] songCloseToLastRemoved:`, songCloseToLastRemoved);
  const { currentSong } = useContext(AppContext);
  const tlid = currentSong?.tlid;
  const shouldAutoFocus = useCallback(
    (sa: Track) => {
      return sa.tlid == tlid || sa.tlid == songCloseToLastRemoved?.tlid;
    },
    [songCloseToLastRemoved, tlid]
  );

  return (
    <LoadingList
      className={`${className} track-list`}
      loading={loading}
      length={songs.length}
      onScroll={onScroll}
      listRef={listRef}
    >
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
              {track.selected && onSelect && (
                // <CheckBoxOutlinedIcon className="secondary-action-btn" onClick={() => onSelect(track)} />
                <IconButton className="select-btn" onClick={() => onSelect(track)}>
                  <CheckBoxOutlinedIcon />
                </IconButton>
              )}
            </Stack>
          }
        >
          <ListItemButton
            autoFocus={shouldAutoFocus(track)}
            selected={track.tlid == tlid}
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
