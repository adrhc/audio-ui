import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { useCallback, useEffect } from 'react';
import useCachedSongsScrollable from '../../hooks/useCachedSongsScrollable';
import { getYTLibrary } from '../../services/audio-db/library';
import { Song, ThinSongListState } from '../../domain/song';
import { useNavigate } from 'react-router-dom';
import { removeLoadingAttributes, SetFeedbackState } from '../../lib/sustain';
import { useMaxEdge } from '../../hooks/useMaxEdge';
import { YOUTUBE_LIBRARY } from '../../hooks/cache/cache-names';
import '/src/styles/wide-page.scss';

function YTMusicLibraryPage() {
  const navigate = useNavigate();
  const {
    state,
    sustain,
    setState,
    addSongOrPlaylist,
    insertSongOrPlaylist,
    listRef,
    scrollObserver,
    scrollTo,
    getCache,
    mergeCache,
  } = useCachedSongsScrollable<ThinSongListState>(YOUTUBE_LIBRARY);
  const cache = getCache();
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[YTMusicLibraryPage]`, { cache, state });

  const imgMaxEdge = useMaxEdge();

  const handleReaload = useCallback(() => {
    console.log(`[YTMusicLibraryPage.useEffect] loading the YT Music library`);
    sustain(
      getYTLibrary(imgMaxEdge).then((songs) => ({ songs })),
      `Failed to load the YouTube Music playlists!`
    );
  }, [imgMaxEdge, sustain]);

  // loading the library if not already loaded
  useEffect(() => {
    if (!songsIsEmpty) {
      console.log(`[YTMusicLibraryPage.useEffect] the YT Music library is already loaded!`);
      return;
    }
    handleReaload();
  }, [handleReaload, songsIsEmpty]);

  // scroll after loading the library
  useEffect(() => {
    // this "if" is critical for correct scrolling position!
    if (songsIsEmpty) {
      console.log(`[YTMusicLibraryPage.useEffect] the library isn't loaded yet or is empty!`);
      return;
    }
    console.log(`[YTMusicLibraryPage.useEffect] scrolling to ${cachedScrollTop}`);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    mergeCache((old) => ({ ...old, ...removeLoadingAttributes(state) }));
  }, [mergeCache, state]);

  const handleSelection = useCallback(
    (song: Song) => {
      mergeCache((old) => ({ ...old, lastUsed: song }));
      navigate(`/ytplcontent/${song.uri}`);
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
        onInsert={insertSongOrPlaylist}
        onClick={handleSelection}
        onReloadList={handleReaload}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default YTMusicLibraryPage;
