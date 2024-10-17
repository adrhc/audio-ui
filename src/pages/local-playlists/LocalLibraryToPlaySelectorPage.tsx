import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../hooks/AppContext';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { Song, ThinSongListState } from '../../domain/song';
import { useNavigate } from 'react-router-dom';
import { getLocalPlaylists } from '../../services/pl-content';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { LOCAL_LIBRARY_PLAY_CACHE } from '../../hooks/cache/cache-names';
import '/src/styles/wide-page.scss';

function LocalLibraryToPlaySelectorPage() {
  const navigate = useNavigate();
  const { mopidy, online } = useContext(AppContext);
  const {
    state,
    sustain,
    setState,
    listRef,
    scrollObserver,
    scrollTo,
    goToPlAdd,
    addSongOrPlaylist,
    insertSongOrPlaylist,
    getCache,
    mergeCache,
    clearCache,
  } = useCachedSongsScrollable<ThinSongListState>(LOCAL_LIBRARY_PLAY_CACHE);
  const cache = getCache();
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[LocalLibraryToPlaySelectorPage]`, { cache, state });

  const handleReaload = useCallback(() => {
    console.log(`[handleReaload] loading the local playlists`);
    sustain(
      getLocalPlaylists(mopidy).then((songs) => ({ songs })),
      `Failed to load the local playlists!`
    );
  }, [mopidy, sustain]);

  // loading the library if not already loaded
  useEffect(() => {
    if (songsIsEmpty) {
      console.log(`[LocalLibraryToPlaySelectorPage.useEffect] online = ${online}`);
      online && handleReaload();
    } else {
      console.log(`[LocalLibraryToPlaySelectorPage.useEffect] the local playlists are already loaded!`);
    }
  }, [handleReaload, online, songsIsEmpty]);

  // scroll after loading the library
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[LocalLibraryToPlaySelectorPage.useEffect] the library isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[LocalLibraryToPlaySelectorPage.useEffect] scrolling to ${cachedScrollTop} after loading the library`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => {
      // state doesn't contain scrollTop hence won't overwrite the cache!
      const backup = { ...old, ...removeLoadingAttributes(state) };
      console.log(`[LocalLibraryToPlaySelectorPage.useEffect/mergeCache] backup:`, { old, backup });
      return backup;
    });
  }, [clearCache, mergeCache, state]);

  const handlePlSelection = useCallback(
    (song: Song) => {
      mergeCache((old) => {
        const backup = { ...old, lastUsed: song };
        console.log(`[LocalLibraryToPlaySelectorPage] stateBackup:`, backup);
        return backup;
      });
      navigate(`/local-playlist-content/${song.uri}`);
    },
    [mergeCache, navigate]
  );

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
        onAdd={addSongOrPlaylist}
        addManySongs={goToPlAdd}
        onInsert={insertSongOrPlaylist}
        onClick={handlePlSelection}
        onReloadList={handleReaload}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default LocalLibraryToPlaySelectorPage;
