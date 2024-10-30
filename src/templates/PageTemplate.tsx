import { ResponsiveStyleValue } from '@mui/system';
import { Stack } from '@mui/material';
import { Loading, SetFeedbackState } from '../lib/sustain/types';
import { NoArgsProc, Styles } from '../domain/types';
import Spinner from '../components/feedback/Spinner';
import CloseableAlert from '../components/feedback/ErrorAlert';
import BackAndHomeButtonsMenu from '../components/menu/BackAndHomeButtonsMenu';
import { ReactNode } from 'react';
import PageTitle from '../components/page-title/PageTitle';
import './PageTemplate.scss';

export interface PageTemplateParam {
  sx?: Styles;
  state?: Loading;
  setState: SetFeedbackState;
  title?: string | ReactNode | null;
  hideContent?: boolean;
  onErrorClose?: NoArgsProc;
  hideBottom?: boolean;
  className?: string;
  pageSpacing?: ResponsiveStyleValue<number | string>;
  contentSpacing?: ResponsiveStyleValue<number | string>;
  bottom?: ReactNode;
  children: ReactNode;
  disableSpinner?: boolean;
  widePage?: boolean;
}

const PageTemplate = ({
  sx,
  state,
  setState,
  title,
  hideContent,
  onErrorClose = () => setState((old) => ({ ...old, error: '' })),
  hideBottom,
  className,
  pageSpacing = 0.5,
  contentSpacing = 0.5,
  bottom,
  children,
  disableSpinner,
  widePage,
}: PageTemplateParam) => {
  return (
    <>
      <Spinner show={!disableSpinner && state?.loading} />
      <Stack
        className={`${className ?? ''} ${widePage ? 'wide-page page' : 'page'}`}
        spacing={pageSpacing}
        sx={sx}
      >
        {/* {!hideTop && <Stack className="top" />} */}
        <Stack className="page-content" spacing={contentSpacing}>
          <CloseableAlert className="ignored" message={state?.error} onClose={onErrorClose} />
          <PageTitle title={title} />
          {!hideContent && children}
        </Stack>
        {bottom}
        {!hideBottom && !bottom && <BackAndHomeButtonsMenu />}
      </Stack>
    </>
  );
};

export default PageTemplate;
