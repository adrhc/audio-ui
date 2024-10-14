import { useCallback } from 'react';
import { NoArgsProc } from '../domain/types';
import { useNavigate } from 'react-router-dom';

export interface UseAppNavigator {
  goToPlAdd: NoArgsProc;
}

export default function useAppNavigator() {
  const navigate = useNavigate();

  const goToPlAdd = useCallback(() => {
    navigate('/add-playlist');
  }, [navigate]);

  return { goToPlAdd };
}
