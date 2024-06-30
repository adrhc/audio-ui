import { useCallback, useRef } from 'react';

export type SUBMIT = () => boolean | undefined;

export default function useFormRef(): [React.RefObject<HTMLFormElement>, SUBMIT] {
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useCallback(
    () => formRef.current?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
    [formRef]
  );
  return [formRef, submit];
}
