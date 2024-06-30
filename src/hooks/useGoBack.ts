import { useNavigate } from 'react-router-dom';
import { useEmptyHistory } from './useEmptyHistory';

export function useGoBack(fallback: string = '/player') {
  const emptyHistory = useEmptyHistory();
  const navigate = useNavigate();
  return () => (emptyHistory ? navigate(fallback) : navigate(-1));
}
