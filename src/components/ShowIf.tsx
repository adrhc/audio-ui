import { ReactNode } from 'react';

const ShowIf = ({
  condition,
  children,
  otherwise,
}: {
  condition: boolean | null | undefined;
  children: ReactNode;
  otherwise?: ReactNode;
}) => {
  if (condition) {
    return children;
  } else if (otherwise) {
    return otherwise;
  }
};

export default ShowIf;
