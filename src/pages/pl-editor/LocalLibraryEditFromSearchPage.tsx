import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Song } from '../../domain/song';
import { toQueryParams } from '../../lib/path-param-utils';
import LocalLibraryEditTemplatePage from './LocalLibraryEditTemplatePage';

function LocalLibraryEditFromSearchPage() {
  const navigate = useNavigate();

  const goToPlToEdit = useCallback(
    (playlist: Song) => {
      // console.log(`[LocalLibraryEditFromSearchPage.goToPlToEdit] playlist:`, playlist);
      // navigate(`/playlist-edit-from-search/${encodeURIComponent(song.uri)}?${toQueryParams(['title', encodeURIComponent(song.title)])}`);
      navigate(`/playlist-edit-from-search/${playlist.uri}?${toQueryParams(['title', playlist.title])}`);
    },
    [navigate]
  );

  return <LocalLibraryEditTemplatePage goToPlToEdit={goToPlToEdit} />;
}

export default LocalLibraryEditFromSearchPage;
