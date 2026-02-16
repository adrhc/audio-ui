import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../hooks/AppContext';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { Song, ThinSongListState } from '../../domain/song';
import { useNavigate } from 'react-router-dom';
import { SetFeedbackState } from '../../lib/sustain/types';
import { removeLoadingProps } from '../../lib/sustain/types';
import { LOCAL_LIBRARY_PLAY_CACHE } from '../../hooks/cache/cache-names';
import { AddManyFn } from '../../components/list/SongListItemMenuParam';

function LocalLibraryPage() {
  const navigate = useNavigate();
  const { online } = useContext(AppContext);
  const {
    state,
    setState,
    listRef,
    scrollObserver,
    scrollTo,
    goToPlAdd,
    addSongOrPlaylist,
    insertSongOrPlaylist,
    getCache,
    mergeCache,
    loadLocalLibrary
  } = useCachedSongsScrollable<ThinSongListState>(LOCAL_LIBRARY_PLAY_CACHE);
  const cache = getCache();
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[LocalLibraryPage]`, { cache, state });

  // loading the library if not already loaded
  useEffect(() => {
    if (songsIsEmpty) {
      console.log(`[LocalLibraryPage.useEffect] online = ${online}`);
      online && loadLocalLibrary();
    } else {
      console.log(`[LocalLibraryPage.useEffect] the local playlists are already loaded!`);
    }
  }, [loadLocalLibrary, online, songsIsEmpty]);

  // scroll after loading the library
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[LocalLibraryPage.useEffect] the library isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[LocalLibraryPage.useEffect] scrolling to ${cachedScrollTop}`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => {
      // state doesn't contain scrollTop hence won't overwrite the cache!
      const backup = { ...old, ...removeLoadingProps(state) };
      console.log(`[LocalLibraryPage.useEffect/mergeCache] backup:`, { old, backup });
      return backup;
    });
  }, [mergeCache, state]);

  const handlePlSelection = useCallback(
    (song: Song) => {
      mergeCache((old) => {
        const backup = { ...old, lastUsed: song };
        console.log(`[LocalLibraryPage] stateBackup:`, backup);
        return backup;
      });
      navigate(`/local-playlist-content/${song.uri}`);
    },
    [mergeCache, navigate]
  );

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
        onAddMany={goToPlAdd as AddManyFn}
        onInsert={insertSongOrPlaylist}
        onClick={handlePlSelection}
        onReloadList={loadLocalLibrary}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default LocalLibraryPage;
