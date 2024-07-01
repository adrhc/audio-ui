import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import './PageTitle.scss';

function PageTitle({ title, children }: { title?: string | ReactNode | null; children?: ReactNode }) {
  if (typeof title == 'string') {
    return <Typography className="title">{title}</Typography>;
  } else if (title != null) {
    return title;
  } else if (children != null) {
    return <Typography className="title">{children}</Typography>;
  }
}

export default PageTitle;
