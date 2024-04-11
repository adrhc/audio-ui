import { CirclesWithBar } from 'react-loader-spinner';

export default function Spinner({ show }: { show?: boolean }) {
  if (!show) {
    return <></>;
  }
  return (
    <CirclesWithBar
      height="100%"
      width="100%"
      color="black"
      outerCircleColor="black"
      innerCircleColor="black"
      barColor="black"
      ariaLabel="loading ..."
      wrapperStyle={{
        lineHeight: '1',
        maxWidth: '60%',
        maxHeight: '60%',
        margin: 'auto',
      }}
      visible={true}
    />
  );
}
