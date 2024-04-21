import { Stack } from "@mui/material";
import Spinner from "../Spinner";

const SpinnerPannel = ({ loading }: { loading?: boolean }) => {
  return (
    loading && (
      <Stack className="panel">
        <Spinner />
      </Stack>
    )
  );
};

export default SpinnerPannel;
