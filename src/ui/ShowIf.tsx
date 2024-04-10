import { ReactNode } from 'react';

const ShowIf = ({ condition, children }: { condition: boolean; children: ReactNode }) => {
  if (condition) {
    return children;
  } else {
    return <></>;
  }
};

export default ShowIf;
