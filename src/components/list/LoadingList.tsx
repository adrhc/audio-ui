import { ReactNode } from 'react';
import { LoadingState } from '../../lib/sustain/types';
import SpinnerPannel from '../panel/SpinnerPannel';
import EmptyList from './EmptyList';
import { List, Stack } from '@mui/material';
import '/src/styles/list/list-wrapper.scss';
import '/src/styles/list/list.scss';

interface LoadingListParam {
  length?: number | null;
  empty?: boolean | null;
  children: ReactNode;
  className?: string;
  listRef?: React.RefObject<HTMLUListElement | null>;
  onScroll?: (e: React.UIEvent<HTMLUListElement>) => void;
}

function LoadingList({
  loading,
  length,
  empty = !length,
  className,
  listRef,
  onScroll,
  children,
}: LoadingState<LoadingListParam>) {
  if (loading || !empty) {
    return (
      <Stack className="list-wrapper">
        <SpinnerPannel show={loading} />
        {((length ?? 0 > 0) || !loading) && (
          <List
            className={`list ${className ?? ''} ${length == 0 ? 'zero-length' : ''}`}
            onScroll={onScroll}
            ref={listRef}
          >
            {!empty && children}
          </List>
        )}
      </Stack>
    );
  } else {
    return (
      <Stack className="list-wrapper">
        <EmptyList />
      </Stack>
    );
  }
}

export default LoadingList;
