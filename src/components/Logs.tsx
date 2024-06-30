import { Typography } from '@mui/material';

export type LogsParam = { logs: string[] };

export default function Logs({ logs }: LogsParam) {
  return logs.map((l, i) => <Typography key={i}>{l}</Typography>);
}
