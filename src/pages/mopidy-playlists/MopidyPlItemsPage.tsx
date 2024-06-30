import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../components/app/AppContext';
import useSongsList, { RawSongsListState, pickRawSongsListState } from '../songssearch/useSongsList';
import { useParams } from 'react-router-dom';
import PageTemplate from '../../templates/PageTemplate';
import { Stack } from '@mui/material';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { scrollTop } from '../../domain/scroll';
import { getPlaylistItems } from '../../services/pl-content';
import { SetFeedbackState } from '../../lib/sustain';

type MopidyPlItemsPageCache = { scrollTop: number } & RawSongsListState;

function MopidyPlItemsPage() {
  const { uri } = useParams();
  const cacheName = `mopidy-playlist/${uri}`;
  const { mopidy, getCache, mergeCache } = useContext(AppContext);
  const [
    state,
    sustain,
    setState,
    handleSelection,
    handleAdd,
    handleAddAll,
    handleInsert,
    listRef,
    scrollTo,
    scrollObserver,
    currentSong,
  ] = useSongsList<RawSongsListState>(cacheName);
  const cache = getCache(cacheName) as MopidyPlItemsPageCache;
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[MopidyPlItemsPage] cacheName = ${cacheName}:`, {
    currentSong,
    cache,
    state,
  });

  const handleReaload = useCallback(() => {
    if (!uri) {
      console.log(`[MopidyPlItemsPage.handleReaload] can't load "null" the Mopidy playlist!`);
      return;
    }
    console.log(`[MopidyPlItemsPage.handleReaload] loading ${uri}`);
    sustain(
      getPlaylistItems(mopidy, uri).then((songs) => ({ songs })),
      `Failed to load the playlist!`
    );
  }, [mopidy, sustain, uri]);

  // loading the playlist if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[MopidyPlItemsPage.useEffect] ${uri} is already loaded!`);
      return;
    }
    handleReaload();
  }, [handleReaload, songsIsEmpty, uri]);

  // scroll after loading the playlist
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[MopidyPlItemsPage.useEffect] ${uri} isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[MopidyPlItemsPage.useEffect] scrolling to ${cachedScrollTop} after loading ${uri}`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty, uri]);

  // cache the current state
  useEffect(() => {
    if (!state.songs.length) {
      console.log(`[MopidyPlItemsPage.backup] no songs to backup! ${uri}`);
      return;
    }
    mergeCache(cacheName, (old) => {
      const backup = { ...pickRawSongsListState(state), scrollTop: scrollTop(old) };
      console.log(`[MopidyPlItemsPage.backup] ${uri}:`, backup);
      return backup;
    });
  }, [mergeCache, cacheName, state, uri]);

  return (
    <PageTemplate
      className="song-list-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TracksAccessMenu />}
    >
      <Stack className="songs-wrapper">
        <SongList
          songs={state.songs}
          currentSong={currentSong}
          onAdd={handleAdd}
          onInsert={handleInsert}
          onClick={handleSelection}
          lastUsed={state.lastUsed}
          onScroll={scrollObserver}
          listRef={listRef}
          scrollTo={scrollTo}
          onRealoadList={handleReaload}
          onAddAllSongs={handleAddAll}
        />
      </Stack>
    </PageTemplate>
  );
}

export default MopidyPlItemsPage;
