import { models } from 'mopidy';
import * as appsong from '../../domain/song';
import * as apppl from '../../domain/media-location';
import * as apphistory from '../../domain/history';
import { sortByAbsDiff } from '../../lib/image';

export function toSongsWithImgUri(imgMaxEdge: number, audioDbSongs: Song[]): appsong.Song[] {
  if (imgMaxEdge <= 0) {
    return toSongs(audioDbSongs);
  }
  const imgMaxArea = imgMaxEdge * imgMaxEdge;
  return audioDbSongs.map((it) => toSongWithImgUri(imgMaxArea, it));
}

function toSongWithImgUri(imgMaxArea: number, audioDbSong: Song): appsong.Song {
  const sortedThumbnails = sortByAbsDiff(imgMaxArea, audioDbSong.thumbnails);
  return { imgUri: sortedThumbnails?.[0]?.uri, ...toSong(audioDbSong) };
}

export function toHistoryPage(imgMaxArea: number, audioDbHistoryPage: HistoryPage): apphistory.HistoryPage {
  const { entries, ...historyPage } = audioDbHistoryPage;
  return { ...historyPage, entries: toSongsWithImgUri(imgMaxArea, entries) };
}

export function toSongsPage(audioDbSongsPage: SongsPage): appsong.SongsPage {
  return { entries: toSongs(audioDbSongsPage.entries) };
}

export function pageToSongs(page: SongsPage): appsong.Song[] {
  return toSongs(page.entries);
}

export function toSongs(audioDbSongs: Song[]): appsong.Song[] {
  return audioDbSongs.map(toSong);
}

export function toAudioDbLocationSelections(
  uri: string,
  title: string | null | undefined,
  selections: apppl.LocationSelection[]
): LocationSelections {
  return { uri, title, selections: selections.map(toAudioDbLocationSelection) };
}

export function toAudioDbLocationSelection(location: apppl.LocationSelection): LocationSelection {
  const { type, title, uri } = location;
  return { location: { type, name: title, uri }, selected: location.selected };
}

export function toLocationSelections(audioDbMarkedPls: LocationSelections): apppl.LocationSelection[] {
  return audioDbMarkedPls.selections.map(toLocationSelection);
}

export function toSong(audioDbSong: Song): appsong.Song {
  const { title, location } = audioDbSong;
  const { type, uri } = location;
  return { type, uri, formattedUri: appsong.formatUri(uri)!, title };
}

export function toLocationSelection(audioDbLocationSelection: LocationSelection): apppl.LocationSelection {
  return {
    ...toMediaLocation(audioDbLocationSelection.location),
    selected: audioDbLocationSelection.selected,
  };
}

export function toMediaLocations(audioDbLocations: MediaLocation[]): apppl.MediaLocation[] {
  return audioDbLocations.map(toMediaLocation);
}

export function toMediaLocation(audioDbLoc: MediaLocation): apppl.MediaLocation {
  const { type, name, uri } = audioDbLoc;
  return { type, title: name ?? apppl.uriToTitle(uri)!, uri, formattedUri: appsong.formatUri(uri)! };
}

export interface HistoryPage extends SongsPage {
  first: apphistory.HistoryPosition;
  last: apphistory.HistoryPosition;
  pageBeforeExists: boolean;
  pageAfterExists: boolean;
  completePageSize: number;
}

export interface SongsPage {
  entries: Song[];
}

export interface LocationSelections {
  selections: LocationSelection[];
  uri: string;
  title?: string | null;
}

export interface LocationSelection {
  location: MediaLocation;
  selected: boolean;
}

export interface Song {
  location: MediaLocation;
  title: string;
  thumbnails?: models.Image[];
}

export interface Playlist {
  location: MediaLocation;
  title: string;
}

export interface MediaLocation {
  type: string;
  name?: string;
  uri: string;
}
