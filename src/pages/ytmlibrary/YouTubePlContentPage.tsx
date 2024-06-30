import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../components/app/AppContext';
import useSongsList, { RawSongsPageState, pickRawSongsPageState } from '../songssearch/useSongsList';
import { useParams } from 'react-router-dom';
import { getYTPlContent } from '../../services/audio-db/audio-db';
import PageTemplate from '../../templates/PageTemplate';
import { Stack } from '@mui/material';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { scrollTop } from '../../domain/scroll';
import { SetFeedbackState } from '../../lib/sustain';

type YouTubePlContentCache = { scrollTop: number } & RawSongsPageState;

function YouTubePlContentPage() {
  const { uri } = useParams();
  const cacheName = `ytplcontent/${uri}`;
  const { getCache, mergeCache } = useContext(AppContext);
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
  ] = useSongsList<RawSongsPageState>(cacheName);
  const cache = getCache(cacheName) as YouTubePlContentCache;
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[YouTubePlContentPage] cacheName = ${cacheName}:`, {
    currentSong,
    cache,
    state,
  });

  const handleReaload = useCallback(() => {
    if (!uri) {
      console.log(`[YouTubePlContentPage.handleReaload] can't load "null" YouTube playlist!`);
      return;
    }
    console.log(`[YouTubePlContentPage.handleReaload] loading ${uri}`);
    sustain(
      getYTPlContent(uri).then((songs) => ({ songs })),
      `Failed to load the YouTube playlist!`
    );
  }, [sustain, uri]);

  // loading the playlist if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[YouTubePlContentPage.useEffect] ${uri} is already loaded!`);
      return;
    }
    handleReaload();
  }, [handleReaload, songsIsEmpty, uri]);

  // scroll after loading the playlist
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[YouTubePlContentPage.useEffect] ${uri} isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[YouTubePlContentPage.useEffect] scrolling to ${cachedScrollTop} after loading ${uri}`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty, uri]);

  // cache the current state
  useEffect(() => {
    if (!state.songs.length) {
      console.log(`[YouTubePlContentPage.backup] no songs to backup! ${uri}`);
      return;
    }
    mergeCache(cacheName, (old) => {
      const backup = { ...pickRawSongsPageState(state), scrollTop: scrollTop(old) };
      console.log(`[YouTubePlContentPage.backup] ${uri}:`, backup);
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

export default YouTubePlContentPage;
