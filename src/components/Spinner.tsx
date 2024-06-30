import { Backdrop } from '@mui/material';
import { CirclesWithBar } from 'react-loader-spinner';

export type SpinnerStyle = {
  [key: string]: string;
};

export type SpinnerParam = {
  show?: boolean | null;
  className?: string;
  wrapperStyle?: SpinnerStyle;
};

export default function Spinner({ show, className, wrapperStyle }: SpinnerParam) {
  return (
    <Backdrop
      className={className}
      sx={{ backgroundColor: 'transparent', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={show ?? false}
    >
      <CirclesWithBar
        height="100%"
        width="100%"
        color="black"
        outerCircleColor="black"
        innerCircleColor="black"
        barColor="black"
        ariaLabel="loading ..."
        wrapperStyle={{
          // zIndex: '1201',
          lineHeight: '0',
          maxWidth: '60%',
          maxHeight: '60%',
          margin: 'auto',
          ...wrapperStyle,
        }}
        visible={true}
      />
    </Backdrop>
  );
}
