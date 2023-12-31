import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  API_PATH,
  INITIAL_POSITION,
  SUBSCRIPTION_KEY,
} from '../../app/constants';

function SearhcBox({ setLocationList }) {
  const [query, setQuery] = useState('');

  // fetch query list by keyword
  const fetchData = async (keyword) => {
    const response = await fetch(`${API_PATH.SEARCH}&${new URLSearchParams({
      'subscription-key': SUBSCRIPTION_KEY,
      query: keyword,
      lat: INITIAL_POSITION[1],
      lon: INITIAL_POSITION[0],
      view: 'Auto',
    })}`);

    const result = await response.json();
    setLocationList(result.results);
  };

  const handleSearchLocation = (e) => {
    if (e.keyCode === 13) {
      fetchData(query);
    }
  };

  return (
    <Box
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      autoComplete="off"
      noValidate
    >
      <TextField
        defaultValue=""
        id="outlined-size-small"
        label="Search..."
        placeholder="search for something..."
        size="small"
        onChange={(e) => { setQuery(e.target.value); }}
        onKeyDown={(e) => {
          handleSearchLocation(e);
        }}
      />
    </Box>
  );
}

export default SearhcBox;
