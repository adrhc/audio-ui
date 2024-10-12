import { useCallback, useEffect } from 'react';
import useSongList, { ThinSongListState } from '../../hooks/list/useSongList';
import { useParams } from 'react-router-dom';
import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { getPlaylistItems } from '../../services/pl-content';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { useMaxEdge } from '../../constants';
import { plContentCacheName } from './LocalPlContentUtils';
import '/src/styles/wide-page.scss';

function LocalPlContentPage() {
  const { uri } = useParams();
  const cacheName = plContentCacheName(uri);
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
    getCache,
    mergeCache,
    clearCache,
  } = useSongList<ThinSongListState>(cacheName);
  const cache = getCache();
  console.log(`[LocalPlContentPage] uri = ${uri}, cacheName = ${cacheName}\n`, {
    currentSong,
    state,
    cache,
  });

  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;

  const imgMaxEdge = useMaxEdge();

  const loadPlContent = useCallback(() => {
    if (uri) {
      console.log(`[LocalPlContentPage.loadPlContent] loading ${uri}`);
      sustain(
        getPlaylistItems(imgMaxEdge, uri).then((songs) => ({ songs })),
        `Failed to load the playlist!`
      );
    } else {
      console.log(`[LocalPlContentPage.loadPlContent] "uri" is empty!`);
    }
  }, [imgMaxEdge, sustain, uri]);

  // loading the playlist if not already loaded
  useEffect(() => {
    if (songsIsEmpty) {
      loadPlContent();
    }
  }, [loadPlContent, songsIsEmpty, uri]);

  // scroll after loading the playlist
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[LocalPlContentPage.useEffect] ${uri} isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[LocalPlContentPage.useEffect] scrolling to ${cachedScrollTop} after loading ${uri}`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty, uri]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...removeLoadingAttributes(state) }));
  }, [mergeCache, state, uri, clearCache]);

  return (
    <PageTemplate
      className="wide-page"
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
        onReloadList={loadPlContent}
        onAddAllSongs={handleAddAll}
      />
    </PageTemplate>
  );
}

export default LocalPlContentPage;
