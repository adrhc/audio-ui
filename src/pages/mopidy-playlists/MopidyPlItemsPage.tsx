import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../components/app/AppContext';
import useSongList, { RawSongsPageState, pickRawSongsPageState } from '../../hooks/list/useSongList';
import { useParams } from 'react-router-dom';
import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { scrollTop } from '../../domain/scroll';
import { getPlaylistItems } from '../../services/pl-content';
import { SetFeedbackState } from '../../lib/sustain';
import '/src/styles/wide-list-page.scss';

type MopidyPlItemsPageCache = { scrollTop: number } & RawSongsPageState;

function MopidyPlItemsPage() {
  const { uri } = useParams();
  const cacheName = `mopidy-playlist/${uri}`;
  const { mopidy, online, getCache, mergeCache } = useContext(AppContext);
  const {
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
  } = useSongList<RawSongsPageState>(cacheName);
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
    online && handleReaload();
  }, [handleReaload, online, songsIsEmpty, uri]);

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
      const backup = { ...pickRawSongsPageState(state), scrollTop: scrollTop(old) };
      console.log(`[MopidyPlItemsPage.backup] ${uri}:`, backup);
      return backup;
    });
  }, [mergeCache, cacheName, state, uri]);

  return (
    <PageTemplate
      className="wide-list-page"
      state={state}
      setState={setState as SetFeedbackState}
      hideTop={true}
      bottom={<TracksAccessMenu />}
      disableSpinner={true}
    >
      <SongList
        songs={state.songs}
        loading={state.loading}
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
    </PageTemplate>
  );
}

export default MopidyPlItemsPage;
