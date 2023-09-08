import React, { useEffect } from 'react';
import {
  AzureMap,
  AzureMapsProvider,
  AuthenticationType,
  CameraOptions
} from 'react-azure-maps';
import MapController from './MapController';
// import styles from './SearchLocation.module.css';

const option = {
  center: [-74.0060, 40.7128],
  zoom: 14,
  view: 'Auto',
  authOptions: {
    subscriptionKey: process.env['REACT_APP_SUBSCRIPTION_KEY'],
    authType: AuthenticationType.subscriptionKey,
  },
};

const SearchLocation = () => {
  let minSearchInputLength = 3; // The minimum number of characters needed in the search input before a search is performed.
  let keyStrokeDelay = 150; // The number of ms between key strokes to wait before performing a search.

  return (
    <AzureMapsProvider>
      <div style={{ height: '300px' }}>
        <AzureMap options={option} />
        <MapController />
      </div>
  </AzureMapsProvider>
  );
};

export default SearchLocation;

// ref: https://codesandbox.io/s/map-forked-6nbwi?file=/src/App.js