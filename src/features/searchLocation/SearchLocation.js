import { useState } from 'react';
import Stack from '@mui/material/Stack';
import {
  AuthenticationType,
  AzureMap,
  AzureMapsProvider,
} from 'react-azure-maps';
import SearchResultList from './SearchResultList';
import MapController from './MapController';
import { INITIAL_POSITION, SUBSCRIPTION_KEY } from '../../app/constants';

const option = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: SUBSCRIPTION_KEY,
  },
  center: INITIAL_POSITION,
  view: 'Auto',
  zoom: 14,
};

function SearchLocation() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  return (
    <AzureMapsProvider>
      <Stack direction="row" spacing={2}>
        <div style={{ width: '100%', height: '600px' }}>
          <AzureMap options={option} />
          <MapController selectedPosition={selectedPosition} selectedDetail={selectedDetail} />
        </div>
        <SearchResultList
          setSelectedPosition={setSelectedPosition}
          setSelectedDetail={setSelectedDetail}
        />
      </Stack>
    </AzureMapsProvider>
  );
}

export default SearchLocation;
