import PageTemplate from '../../templates/PageTemplate';
import SongList from '../../components/list/SongList';
import TracksAccessMenu from '../../components/menu/TracksAccessMenu';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../components/app/AppContext';
import useSongList, { RawSongsPageState, pickRawSongsPageState } from '../../hooks/list/useSongList';
import { getYTPlaylists } from '../../services/audio-db/audio-db';
import { Song } from '../../domain/song';
import { useNavigate } from 'react-router-dom';
import { scrollTop } from '../../domain/scroll';
import { SetFeedbackState } from '../../lib/sustain';
import '/src/styles/wide-list-page.scss';
import { useMaxEdge } from '../../constants';

type YouTubePlaylistsCache = { scrollTop: number } & RawSongsPageState;

function YTMusicLibraryPage() {
  const navigate = useNavigate();
  const {
    state,
    sustain,
    setState,
    handleAdd,
    handleInsert,
    listRef,
    scrollObserver,
    scrollTo,
    currentSong,
  } = useSongList<RawSongsPageState>('ytmlibrary');
  const { getCache, mergeCache } = useContext(AppContext);
  const cache = getCache('ytmlibrary') as YouTubePlaylistsCache;
  const cachedScrollTop = cache?.scrollTop ?? 0;
  const songsIsEmpty = state.songs.length == 0;
  console.log(`[YTMusicLibraryPage]`, { currentSong, cache, state });

  const imgMaxEdge = useMaxEdge();

  const handleReaload = useCallback(() => {
    console.log(`[YTMusicLibraryPage.useEffect] loading the YT Music library`);
    sustain(
      getYTPlaylists(imgMaxEdge).then((songs) => ({ songs })),
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
    console.log(`[YTMusicLibraryPage] scrolling to ${cachedScrollTop} after loading the library`);
    // setTimeout(scrollTo, 0, cachedScrollTop);
    scrollTo(cachedScrollTop);
  }, [cachedScrollTop, scrollTo, songsIsEmpty]);

  // cache the current state
  useEffect(() => {
    if (!state.songs.length) {
      console.log(`[YTMusicLibraryPage.useEffect] no songs to backup!`);
      return;
    }
    mergeCache('ytmlibrary', (old) => {
      const backup = { ...pickRawSongsPageState(state), scrollTop: scrollTop(old) };
      console.log(`[YTMusicLibraryPage] stateBackup:`, backup);
      return backup;
    });
  }, [mergeCache, state]);

  const handleSelectionProxy = useCallback(
    (song: Song) => {
      // console.log(`[YouTubePlaylistsPage.handleSelectionProxy] isYtLiked:`, isYtLiked(song));
      mergeCache('ytmlibrary', (old) => {
        const backup = { ...(old as object), scrollTop: scrollTop(old), lastUsed: song };
        console.log(`[YTMusicLibraryPage] stateBackup:`, backup);
        return backup;
      });
      navigate(`/ytplcontent/${song.uri}`);
    },
    [mergeCache, navigate]
  );

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
        onClick={handleSelectionProxy}
        onRealoadList={handleReaload}
        lastUsed={state.lastUsed}
        onScroll={scrollObserver}
        listRef={listRef}
        scrollTo={scrollTo}
      />
    </PageTemplate>
  );
}

export default YTMusicLibraryPage;
