import { useCallback, useContext, useEffect } from 'react';
import PageTemplate from '../../templates/PageTemplate';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import SongList from '../../components/list/SongList';
import { AppContext } from '../../hooks/AppContext';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { Song, ThinSongListState } from '../../domain/song';
import { LOCAL_LIBRARY_EDIT_CACHE } from '../../hooks/cache/cache-names';
import '/src/styles/wide-page.scss';
import '/src/styles/list/list-with-1x-secondary-action.scss';

export interface LocalLibraryEditTemplatePageParams {
  goToPlToEdit: (playlist: Song) => void;
}

function LocalLibraryEditTemplatePage({ goToPlToEdit }: LocalLibraryEditTemplatePageParams) {
  const { online, credentials } = useContext(AppContext);
  const {
    state,
    setState,
    listRef,
    scrollObserver,
    scrollTo,
    getScrollPosition,
    goToPlAdd,
    currentSong,
    mergeCache,
    loadLocalLibrary,
    removePlaylist,
  } = useCachedSongsScrollable<ThinSongListState>(LOCAL_LIBRARY_EDIT_CACHE);

  const songsIsEmpty = state.songs.length == 0;
  // console.log(`[LocalLibraryEditTemplatePage]`, currentSong, state, credentials);

  // loading the library if not already loaded
  useEffect(() => {
    if (songsIsEmpty) {
      online && loadLocalLibrary();
    } else {
      console.log(`[LocalLibraryEditTemplatePage.useEffect] the local library is already loaded!`);
    }
  }, [loadLocalLibrary, online, songsIsEmpty]);

  // scroll after loading the library
  const scrollPosition = getScrollPosition();
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[LocalLibraryEditTemplatePage.useEffect] the library isn't loaded yet or is empty!`);
    } else {
      console.log(`[LocalLibraryEditTemplatePage.useEffect] scrolling to ${scrollPosition}`);
      // setTimeout(scrollTo, 0, cachedScrollTop);
      scrollTo(scrollPosition);
    }
  }, [scrollPosition, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...removeLoadingAttributes(state) }));
  }, [mergeCache, state]);

  const setLastUsedThenGoToPlToEdit = useCallback(
    (playlist: Song) => {
      // console.log(`[LocalLibraryEditTemplatePage.setLastUsedThenGoToPlToEdit] playlist:`, playlist);
      mergeCache((old) => ({ ...old, lastUsed: playlist }));
      goToPlToEdit(playlist);
    },
    [goToPlToEdit, mergeCache]
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
        className="list-with-1x-secondary-action"
        songs={state.songs}
        loading={state.loading}
        currentSong={currentSong}
        onClick={setLastUsedThenGoToPlToEdit}
        onDelete={credentials.isValid() ? removePlaylist : undefined}
        addManySongs={goToPlAdd}
        onReloadList={loadLocalLibrary}
        lastUsed={state.lastUsed}
        listRef={listRef}
        onScroll={scrollObserver}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default LocalLibraryEditTemplatePage;
