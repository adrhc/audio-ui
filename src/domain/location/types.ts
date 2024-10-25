import Selectable from '../Selectable';

export interface LocationSelection extends MediaLocation, Selectable {}

export interface MediaLocation {
  type: string;
  uri: string;
  formattedUri: string;
  title: string;
}
