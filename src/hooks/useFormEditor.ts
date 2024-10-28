import { useCallback } from 'react';
import { SetLoadingState } from '../lib/sustain/types';

export type HTMLInputElementChangeEventFn = (event: React.ChangeEvent<HTMLInputElement>) => void;

export interface UseFormEditor {
    handleInputElementChange: HTMLInputElementChangeEventFn;
}

export default function useFormEditor<S>(setState: SetLoadingState<S>): UseFormEditor {
  const handleInputElementChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      // console.log(`[PresetEditForm.handleChange] changed:`, { [name]: value });
      setState((prevState) => ({ ...prevState, [name]: +value }));
    },
    [setState]
  );

  return { handleInputElementChange };
}
