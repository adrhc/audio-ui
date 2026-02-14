import { useCallback, useContext, useEffect } from 'react';
import PageTemplate from '../../templates/PageTemplate';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import SongList from '../../components/list/SongList';
import { AppContext } from '../../hooks/AppContext';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { SetFeedbackState } from '../../lib/sustain/types';
import { removeLoadingProps } from '../../lib/sustain/types';
import { Song, ThinSongListState } from '../../domain/song';
import { LOCAL_LIBRARY_EDIT_CACHE } from '../../hooks/cache/cache-names';
import { useNavigate } from 'react-router-dom';
import { toQueryParams } from '../../lib/url-search-params';
import '/src/styles/list/list-with-1x-secondary-action.scss';
import { AddManySongsFn } from '../../hooks/usePlayingList';

export interface LocalLibraryEditTemplatePageParams {
  playlistEditorPath: string;
}

function LocalLibraryEditTemplatePage({ playlistEditorPath }: LocalLibraryEditTemplatePageParams) {
  const navigate = useNavigate();
  const { online, credentials } = useContext(AppContext);
  const {
    state,
    setState,
    listRef,
    scrollObserver,
    scrollTo,
    getScrollPosition,
    goToPlAdd,
    mergeCache,
    loadLocalLibrary,
    removePlaylist,
  } = useCachedSongsScrollable<ThinSongListState>(LOCAL_LIBRARY_EDIT_CACHE);

  const songsIsEmpty = state.songs.length == 0;
  // console.log(`[LocalLibraryEditTemplatePage]`, state, credentials);

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
    mergeCache((old) => ({ ...old, ...removeLoadingProps(state) }));
  }, [mergeCache, state]);

  const goToPlaylistEditor = useCallback(
    (playlist: Song) => {
      // console.log(`[LocalLibraryEditTemplatePage.setLastUsedThenGoToPlToEdit] playlist:`, playlist);
      mergeCache((old) => ({ ...old, lastUsed: playlist }));
      // navigate(`/playlist-edit-from-search/${encodeURIComponent(song.uri)}?${toQueryParams(['title', encodeURIComponent(song.title)])}`);
      navigate(`${playlistEditorPath}/${playlist.uri}?${toQueryParams(['title', playlist.title])}`);
    },
    [mergeCache, navigate, playlistEditorPath]
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
        className="list-with-1x-secondary-action"
        songs={state.songs}
        loading={state.loading}
        onClick={goToPlaylistEditor}
        onDelete={credentials.isValid() ? removePlaylist : undefined}
        addManySongs={goToPlAdd as AddManySongsFn}
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
