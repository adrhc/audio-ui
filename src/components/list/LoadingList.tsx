import { ReactNode } from 'react';
import { LoadingState } from '../../lib/sustain';
import SpinnerPannel from '../panel/SpinnerPannel';
import EmptyList from '../EmptyList';
import { List } from '@mui/material';

interface LoadingListParam {
  length?: number | null;
  empty?: boolean | null;
  children: ReactNode;
  className?: string;
  listRef?: React.RefObject<HTMLUListElement>;
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
  if (!loading && empty) {
    return <EmptyList />;
  }

  return (
    <>
      <SpinnerPannel show={loading} />
      {((length ?? 0 > 0) || !loading) && (
        <List className={className} onScroll={onScroll} ref={listRef}>
          {!empty && children}
        </List>
      )}
    </>
  );
}

export default LoadingList;
