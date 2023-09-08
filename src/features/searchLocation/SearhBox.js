import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { API_PATH, SUBSCRIPTION_KEY } from '../../app/constants';

const SearhcBox = ({ setLocationList }) => {
  const [query, setQuery] = useState('');

  const handleSearchLocation = (e) => {
    if (e.keyCode === 13) {
      fetchData(query);
    }
  };

  // fetch query list by keyword
  const fetchData = async (query) => {
    const response = await fetch(`${API_PATH.SEARCH}&` + new URLSearchParams({
      'subscription-key': SUBSCRIPTION_KEY,
      query,
      lat: 40.712784779958255,
      lon: -74.00600910186768,
      view: 'Auto'
    }));

    const result = await response.json();
    setLocationList(result.results);
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
        placeholder='search for something...'
        size="small"
        onChange={(e) => { setQuery(e.target.value)}}
        onKeyDown={(e) => {
          handleSearchLocation(e);
        }}
      />
    </Box>
  );
};

export default SearhcBox;
