import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import SearhcBox from './SearhBox';

const LocationList = ({ setSelectedPosition, setSelectedDetail }) => {
  const [locationList, setLocationList] = useState([]);

  const setSelectedLocationInfo = (item) => {
    setSelectedPosition([item.position.lon, item.position.lat]);
    setSelectedDetail({ name: item.poi.name, url: item.poi.url });
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
    >
      <SearhcBox setLocationList={setLocationList} />
      <ul>
      {
        locationList.map((item) => (
          <ListItem key={item.id} onClick={() => { setSelectedLocationInfo(item) }}>
            <ListItemText primary={item.poi.name} />
          </ListItem>
        ))
      }
      </ul>
    </List>
  )
};

export default LocationList;
