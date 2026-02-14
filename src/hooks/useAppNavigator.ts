import { useCallback } from 'react';
import { NavigateToProc } from '../domain/types';
import { useNavigate } from 'react-router-dom';

export interface UseAppNavigator {
  goToPlAdd: NavigateToProc;
}

export default function useAppNavigator() {
  const navigate = useNavigate();

  const goToPlAdd = useCallback(() => {
    return navigate('/add-playlist');
  }, [navigate]);

  return { goToPlAdd };
}
