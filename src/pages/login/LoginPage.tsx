import { Button, Stack, TextField } from '@mui/material';
import { useSustainableState } from '../../hooks/useSustainableState';
import { useCallback, useContext } from 'react';
import PageTemplate from '../../templates/PageTemplate';
import { AppContext } from '../../components/app/AppContext';
import { useGoBack } from '../../hooks/useGoBack';
import { Credentials } from '../../domain/credentials';
import { SetFeedbackState } from '../../lib/sustain';
import BackwardIcon from '../../components/BackwardIcon';
import LoginIcon from '@mui/icons-material/Login';
import './LoginPage.scss';

type LoginPageState = {
  user?: string | null;
  password?: string | null;
};

function LoginPage() {
  const goBackFn = useGoBack();
  const { credentials, setCredentials } = useContext(AppContext);
  const [state, , setState] = useSustainableState<LoginPageState>({ ...credentials });
  // console.log(`[LoginPage] state:`, state);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      // console.log(`[LoginPage.handleChange] changed:`, { [name]: value });
      setState((prevState) => ({ ...prevState, [name]: value }));
    },
    [setState]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setCredentials(new Credentials(state.user, state.password));
      goBackFn();
    },
    [goBackFn, setCredentials, state.password, state.user]
  );

  return (
    <PageTemplate
      className="login-page"
      state={state}
      setState={setState as SetFeedbackState}
      title="Login"
      bottom={<div />}
    >
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          required
          autoComplete="username"
          label="User Name"
          name="user"
          value={state.user ?? ''}
          onChange={handleChange}
        />
        <TextField
          required
          autoComplete="new-password"
          label="Password"
          type="password"
          name="password"
          value={state.password ?? ''}
          onChange={handleChange}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={goBackFn}>
            <BackwardIcon />
          </Button>
          <Button type="submit" variant="outlined">
            <LoginIcon />
          </Button>
        </Stack>
      </Stack>
    </PageTemplate>
  );
}

export default LoginPage;
