import { Slider, Typography } from '@mui/material';
import { useState } from 'react';

function Dashboard() {
  const [sliderVolume, setSliderVolume] = useState(0);

  return (
    <>
      <Typography variant="h6">Dashboard</Typography>
      <Slider
        value={sliderVolume}
        onChange={(_e, newValue) => setSliderVolume(newValue as number)}
      ></Slider>
    </>
  );
}

export default Dashboard;
