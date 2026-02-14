import { useCallback, useEffect } from 'react';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { useParams } from 'react-router-dom';
import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { getPlContent } from '../../infrastructure/playlist';
import { SetFeedbackState } from '../../lib/sustain/types';
import { removeLoadingProps } from '../../lib/sustain/types';
import { useMaxEdge } from '../../hooks/useMaxEdge';
import { plCacheName } from '../../hooks/cache/cache-names';
import { ThinSongListState } from '../../domain/song';

function LocalPlaylistPlaySelectorPage() {
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
    scrollTo,
    scrollObserver,
    getCache,
    mergeCache,
    clearCache,
  } = useCachedSongsScrollable<ThinSongListState>(cacheName);
  const cache = getCache();
  console.log(`[LocalPlaylistItemToPlaySelectorPage] uri = ${uri}, cacheName = ${cacheName}\n`, {
    state,
    cache,
  });

  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;

  const imgMaxEdge = useMaxEdge();

  const loadPlContent = useCallback(() => {
    if (uri) {
      console.log(`[LocalPlaylistItemToPlaySelectorPage.loadPlContent] loading ${uri}`);
      sustain(
        getPlContent(imgMaxEdge, uri).then((songs) => ({ songs })),
        `Failed to load the playlist!`
      );
    } else {
      console.log(`[LocalPlaylistItemToPlaySelectorPage.loadPlContent] "uri" is empty!`);
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
      console.log(`[LocalPlaylistItemToPlaySelectorPage.useEffect] ${uri} isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[LocalPlaylistItemToPlaySelectorPage.useEffect] scrolling to ${cachedScrollTop} after loading ${uri}`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty, uri]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...removeLoadingProps(state) }));
  }, [mergeCache, state, uri, clearCache]);

  return (
    <PageTemplate
      widePage={true}
      state={state}
      setState={setState as SetFeedbackState}
      bottom={<TracksAccessMenu />}
      disableSpinner={true}
    >
      <SongList
        songs={state.songs}
        loading={state.loading}
        onAdd={addSongOrPlaylist}
        onInsert={insertSongOrPlaylist}
        onClick={addSongThenPlay}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        scrollTo={scrollTo}
        onReloadList={loadPlContent}
        addManySongs={addManySongs}
      />
    </PageTemplate>
  );
}

export default LocalPlaylistPlaySelectorPage;
