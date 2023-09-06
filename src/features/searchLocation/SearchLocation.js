import React from 'react';
import {
  AzureMap,
  AzureMapsProvider,
  IAzureMapOptions,
  AuthenticationType
} from 'react-azure-maps';

const option = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: process.env['REACT_APP_SUBSCRIPTION_KEY'],
  },
};

const SearchLocation = () => {
  return (
    <AzureMapsProvider>
    <div style={{ height: '300px' }}>
      <AzureMap options={option} />
    </div>
  </AzureMapsProvider>
  );
};

export default SearchLocation;
