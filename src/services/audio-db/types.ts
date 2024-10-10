import { models } from 'mopidy';
import * as appsong from '../../domain/song';
import * as medialoc from '../../domain/media-location';
import * as apphistory from '../../domain/history';
import { sortByAbsDiff } from '../../lib/image';
import Selectable from '../../domain/Selectable';
import { m3uMpcRefUriToFileName } from '../mpc';

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

export function toHistoryPage(audioDbHistoryPage: HistoryPage): apphistory.HistoryPage {
  const { entries, ...historyPage } = audioDbHistoryPage;
  // return { ...historyPage, entries: toSongsWithImgUri(imgMaxArea, entries) };
  return { ...historyPage, entries: toSongs(entries) };
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

export function toUriPlAllocationResult(r: UriPlAllocationResult): medialoc.UriPlAllocationResult {
  return {
    addedTo: toMediaLocations(r.addedTo),
    removedFrom: toMediaLocations(r.removedFrom),
    failedToChange: toMediaLocations(r.failedToChange),
  };
}

export function toAudioDbLocationSelections(
  uri: string,
  title: string | null | undefined,
  selections: medialoc.LocationSelection[]
): LocationSelections {
  return { uri, title, selections: selections.map(toAudioDbLocationSelection) };
}

export function toAudioDbLocationSelection(location: medialoc.LocationSelection): LocationSelection {
  const { type, title, uri } = location;
  return { location: { type, name: title, uri }, selected: location.selected };
}

export function toPlSelections(audioDbMarkedPls: LocationSelections): medialoc.LocationSelection[] {
  return audioDbMarkedPls.selections.map(toPlSelection);
}

export function toSong(audioDbSong: Song): appsong.Song {
  const { title, location } = audioDbSong;
  const { type, uri } = location;
  return { type, uri, formattedUri: appsong.formatUri(uri)!, title };
}

export function toPlSelection(audioDbLocationSelection: LocationSelection): medialoc.LocationSelection {
  return {
    ...toPlMediaLocation(audioDbLocationSelection.location),
    selected: audioDbLocationSelection.selected,
  };
}

export function toMediaLocations(audioDbLocations: MediaLocation[]): medialoc.MediaLocation[] {
  return audioDbLocations.map(toPlMediaLocation);
}

export function toPlMediaLocation(audioDbLoc: MediaLocation): medialoc.MediaLocation {
  const { type, name, uri } = audioDbLoc;
  return {
    type,
    title: name ?? medialoc.uriToTitle(uri)!,
    uri,
    formattedUri: appsong.formatUri(uri)!,
  };
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

export interface LocationSelection extends Selectable {
  location: MediaLocation;
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

export interface UriPlAllocationResult {
  addedTo: MediaLocation[];
  removedFrom: MediaLocation[];
  failedToChange: MediaLocation[];
}

export function toPlContentUpdateRequest(diskPlUri: string, songs: medialoc.MediaLocation[]) {
  return { playlistUri: m3uMpcRefUriToFileName(diskPlUri), songs };
}
