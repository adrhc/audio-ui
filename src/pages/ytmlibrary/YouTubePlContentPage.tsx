import { useCallback, useEffect } from 'react';
import useScrollableCachedSongList from '../../hooks/list/useScrollableCachedSongList';
import { useParams } from 'react-router-dom';
import { getYTPlContent } from '../../services/audio-db/audio-db';
import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { useMaxEdge } from '../../constants';
import { plCacheName } from '../../hooks/cache/cache-names';
import { ThinSongListState } from '../../domain/song';
import '/src/styles/wide-page.scss';

interface YouTubePlContentCache extends ThinSongListState {
  scrollTop: number;
}

function YouTubePlContentPage() {
  const { uri } = useParams();
  const cacheName = plCacheName(uri);
  const {
    state,
    sustain,
    setState,
    addSongThenPlay,
    addSongOrPlaylist,
    addManySongs,
    insertSongOrPlaylist,
    listRef,
    scrollObserver,
    scrollTo,
    currentSong,
    getCache,
    mergeCache,
  } = useScrollableCachedSongList<ThinSongListState>(cacheName);
  const cache = getCache() as YouTubePlContentCache;
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[YouTubePlContentPage] cacheName = ${cacheName}:`, {
    currentSong,
    cache,
    state,
  });

  const imgMaxEdge = useMaxEdge();

  const handleReaload = useCallback(() => {
    if (uri) {
      console.log(`[YouTubePlContentPage.handleReaload] loading ${uri}`);
      sustain(
        getYTPlContent(imgMaxEdge, uri).then((songs) => ({ songs })),
        `Failed to load the YouTube playlist!`
      );
    } else {
      console.log(`[YouTubePlContentPage.handleReaload] can't load "null" YouTube playlist!`);
    }
  }, [imgMaxEdge, sustain, uri]);

  // loading the playlist if not already loaded
  useEffect(() => {
    if (songsIsEmpty) {
      handleReaload();
    } else {
      console.log(`[YouTubePlContentPage.useEffect] ${uri} is already loaded!`);
    }
  }, [handleReaload, songsIsEmpty, uri]);

  // scroll after loading the playlist
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[YouTubePlContentPage.useEffect] ${uri} isn't loaded yet or is empty!`);
    } else {
      console.log(`[YouTubePlContentPage.useEffect] scrolling to ${cachedScrollTop} after loading ${uri}`);
      // setTimeout(scrollTo, 0, cachedScrollTop);
      scrollTo(cachedScrollTop);
    }
  }, [cachedScrollTop, scrollTo, songsIsEmpty, uri]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...removeLoadingAttributes(state) }));
  }, [mergeCache, state]);

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
        onAdd={addSongOrPlaylist}
        onInsert={insertSongOrPlaylist}
        onClick={addSongThenPlay}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        scrollTo={scrollTo}
        onReloadList={handleReaload}
        addManySongs={addManySongs}
      />
    </PageTemplate>
  );
}

export default YouTubePlContentPage;
