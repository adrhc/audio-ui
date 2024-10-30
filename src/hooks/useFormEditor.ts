import { useCallback } from 'react';
import { SetLoadingState } from '../lib/sustain/types';

export type HTMLInputElementChangeEventFn = (event: React.ChangeEvent<HTMLInputElement>) => void;

export interface UseFormEditor {
    handleTextElementChange: HTMLInputElementChangeEventFn;
}

export default function useFormEditor<S>(setState: SetLoadingState<S>): UseFormEditor {
  const handleTextElementChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      // console.log(`[useFormEditor.handleTextElementChange] changed:`, { [name]: value });
      setState((old) => ({ ...old, [name]: value }));
    },
    [setState]
  );

  return { handleTextElementChange };
}
