import { ResponsiveStyleValue } from '@mui/system';
import { Stack, Typography } from '@mui/material';
import ShowIf from '../components/ShowIf';
import { Loading, SetFeedbackState } from '../lib/sustain';
import { NoArgsProc } from '../domain/types';
import Spinner from '../components/Spinner';
import CloseableAlert from '../components/feedback/ErrorAlert';
import BackAndHomeButtonsMenu from '../components/menu/BackAndHomeButtonsMenu';
import { ReactNode } from 'react';
import './PageTemplate.scss';

export interface PageTemplateParam {
  state?: Loading;
  setState: SetFeedbackState;
  title?: string | ReactNode | null;
  hideContent?: boolean;
  onErrorClose?: NoArgsProc;
  hideTop?: boolean;
  hideBottom?: boolean;
  className?: string;
  pageSpacing?: ResponsiveStyleValue<number | string>;
  contentSpacing?: ResponsiveStyleValue<number | string>;
  bottom?: ReactNode;
  children: ReactNode;
  disableSpinner?: boolean;
}

const PageTemplate = ({
  state,
  setState,
  title,
  hideContent,
  onErrorClose = () => setState((old) => ({ ...old, error: '' })),
  hideTop,
  hideBottom,
  className,
  pageSpacing = 0.5,
  contentSpacing = 0.5,
  bottom,
  children,
  disableSpinner,
}: PageTemplateParam) => {
  return (
    <>
      <Spinner show={!disableSpinner && state?.loading} />
      <Stack className={`page ${className ?? ''}`} spacing={pageSpacing}>
        {!hideTop && <Stack className="top"></Stack>}
        <Stack className="content" spacing={contentSpacing}>
          <CloseableAlert className="ignored" message={state?.error} onClose={onErrorClose} />
          <ShowIf condition={!!title}>
            <Typography variant="h6" className="title">
              {title}
            </Typography>
          </ShowIf>
          <ShowIf condition={!hideContent}>{children}</ShowIf>
        </Stack>
        {bottom}
        {!bottom && !hideBottom && <BackAndHomeButtonsMenu />}
      </Stack>
    </>
  );
};

export default PageTemplate;
