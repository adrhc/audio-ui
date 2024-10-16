import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Song } from '../../domain/song';
import { toQueryParams } from '../../lib/path-param-utils';
import LocalLibraryEditTemplatePage from './LocalLibraryEditTemplatePage';
import '/src/styles/wide-page.scss';
import '/src/styles/list/list-with-1x-secondary-action.scss';

function LocalLibraryEditFromPlayingPage() {
  const navigate = useNavigate();

  const goToPlToEdit = useCallback(
    (playlist: Song) => {
      // console.log(`[LocalLibraryEditFromPlayingPage.goToPlToEdit] playlist:`, playlist);
      // navigate(`/playlist-edit-from-playing/${encodeURIComponent(song.uri)}?${toQueryParams(['title', encodeURIComponent(song.title)])}`);
      navigate(`/playlist-edit-from-playing/${playlist.uri}?${toQueryParams(['title', playlist.title])}`);
    },
    [navigate]
  );

  return <LocalLibraryEditTemplatePage goToPlToEdit={goToPlToEdit} />;
}

export default LocalLibraryEditFromPlayingPage;
