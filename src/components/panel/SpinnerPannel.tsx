import { Stack } from '@mui/material';
import { CirclesWithBar } from 'react-loader-spinner';

const SpinnerPannel = ({ show }: { show?: boolean | null }) => {
  return (
    <Stack
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        visibility: `${show ? 'visible' : 'hidden'}`,
      }}
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
          lineHeight: '0',
          maxWidth: '60%',
          maxHeight: '60%',
          margin: 'auto',
        }}
        visible={true}
      />
    </Stack>
  );
};

export default SpinnerPannel;
