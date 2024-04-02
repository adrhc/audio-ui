import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <Container sx={{ pt: 1, pb: 1 }}>
      <Outlet />
    </Container>
  );
}

export default Root;
