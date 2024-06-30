export interface LocationSelection extends MediaLocation {
  selected: boolean;
}

export interface MediaLocation {
  type: string;
  uri: string;
  formattedUri: string;
  title: string;
}

export function filterSelected(selections: LocationSelection[]) {
  return selections.filter((it) => it.selected);
}

export function uriToTitle(uri: string | null | undefined) {
  if (!uri) {
    return uri;
  } else if (uri.startsWith('file:///')) {
    const parts = decodeURIComponent(uri).split('/');
    if (parts.length > 0) {
      return parts[parts.length - 1];
    } else {
      return uri;
    }
  } else if (uri.startsWith('m3u:')) {
    return decodeURIComponent(uri.substring(4));
  } else {
    return uri;
  }
}
