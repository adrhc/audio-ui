import { IconButton, List, ListItem, ListItemButton, Stack } from '@mui/material';
import EmptyList from '../../components/EmptyList';
import { useCallback } from 'react';
import { TrackSong } from '../../domain/track-song';
import TrackListItemText from '../../components/list/TrackListItemText';
import SongListItemAvatar from '../../components/list/SongListItemAvatar';
import { Link } from 'react-router-dom';
import { toQueryParams } from '../../lib/path-param-utils';
import '/src/styles/list/list.scss';
import './TrackList.scss';

type TrackListParam = {
  songs: TrackSong[];
  currentSong?: TrackSong;
  onRemove: (song: TrackSong) => void;
  onClick: (song: TrackSong) => void;
  songCloseToLastRemoved?: TrackSong;
};

function TrackList({ songs, currentSong, onRemove, onClick, songCloseToLastRemoved }: TrackListParam) {
  // console.log(`[TrackList] songCloseToLastRemoved:`, songCloseToLastRemoved);
  const shouldAutoFocus = useCallback(
    (sa: TrackSong) => {
      return sa.tlid == currentSong?.tlid || sa.tlid == songCloseToLastRemoved?.tlid;
    },
    [songCloseToLastRemoved, currentSong?.tlid]
  );
  if (songs.length == 0) {
    return <EmptyList />;
  }
  return (
    <List className="list track-list">
      {songs.map((track, index) => (
        <ListItem
          disablePadding
          key={track.tlid}
          secondaryAction={
            <Stack className="action">
              <IconButton
                className="upsert-pl"
                component={Link}
                to={`/song-playlists-editor/${encodeURIComponent(track.uri)}?${toQueryParams(['title', encodeURIComponent(track.title)])}`}
              >
                {/* <svg fill="grey">
                  <image xlink:href="https://svgur.com/i/AFM.svg" src="btn/audio-playlist-icon.svg" />
                </svg> */}
                {/* <QueueMusicIcon /> */}
                <img src="btn/audio-playlist-icon-70.svg" />
              </IconButton>
              <IconButton className="del-btn" onClick={() => onRemove(track)}>
                <img src="btn/recycle-bin-line-icon.svg" />
              </IconButton>
            </Stack>
          }
        >
          <ListItemButton
            autoFocus={shouldAutoFocus(track)}
            selected={track.tlid == currentSong?.tlid}
            onClick={() => onClick(track)}
          >
            <SongListItemAvatar song={track} />
            <TrackListItemText track={track} index={index + 1} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default TrackList;
