import { CirclesWithBar } from 'react-loader-spinner';

export type SpinnerStyle = {
  [key: string]: string;
};

export type SpinnerParam = {
  hide?: boolean | null | undefined;
  style?: SpinnerStyle | null | undefined;
};

export default function Spinner({ hide, style }: SpinnerParam) {
  if (hide) {
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
        ...style,
      }}
      visible={true}
    />
  );
}
