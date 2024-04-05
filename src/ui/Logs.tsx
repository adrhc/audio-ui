import { Typography } from '@mui/material';

export type LogsParam = { logs: string[] };

const Logs = ({ logs }: LogsParam) => {
  return logs.map((l, i) => <Typography key={i}>{l}</Typography>);
};

export default Logs;
