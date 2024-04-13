import { useLocation } from 'react-router-dom';

export function useEmptyHistory() {
  const location = useLocation();
  return location.key === 'default';
}
