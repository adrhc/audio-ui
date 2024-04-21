import { CirclesWithBar } from 'react-loader-spinner';

export type SpinnerStyle = {
  [key: string]: string;
};

export type SpinnerParam = {
  hide?: boolean | null | undefined;
  wrapperStyle?: SpinnerStyle | null | undefined;
};

export default function Spinner({ hide, wrapperStyle }: SpinnerParam) {
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
        lineHeight: '0',
        maxWidth: '60%',
        maxHeight: '60%',
        margin: 'auto',
        ...wrapperStyle,
      }}
      visible={true}
    />
  );
}
