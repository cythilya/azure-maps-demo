import {
  useContext,
  useEffect,
  useMemo,
} from 'react';
import Box from '@mui/material/Box';
import {
  AzureMapHtmlMarker,
  AzureMapPopup,
  AzureMapsContext,
} from 'react-azure-maps';
import { layer, source } from 'azure-maps-control';
import { INITIAL_POSITION } from '../../app/constants';
import pin from './location-pin.png';

const dataSourceRef = new source.DataSource();
const layerRef = new layer.SymbolLayer(dataSourceRef);

function MapController({ selectedPosition, selectedDetail }) {
  const { mapRef, isMapReady } = useContext(AzureMapsContext);
  const htmlMarkers = [selectedPosition || INITIAL_POSITION];

  const azureHtmlMapMarkerOptions = () => ({
    position: selectedPosition,
    title: selectedDetail?.name,
  });

  const renderHTMLPoint = (coordinates) => (
    <AzureMapHtmlMarker
      isPopupVisible
      key={Math.random()}
      markerContent={<div>{selectedDetail?.name || 'New York City Hall'}</div>}
      options={{ ...azureHtmlMapMarkerOptions(coordinates) }}
    />
  );

  const memoizedHtmlMarkerRender = useMemo(() => htmlMarkers.map((marker) => renderHTMLPoint(marker)), [htmlMarkers, selectedPosition]);

  const changeMapCenter = (position) => {
    if (mapRef) {
      mapRef.setCamera({
        center: position,
        zoom: 15,
      });
    }
  };

  useEffect(() => {
    changeMapCenter(selectedPosition);
  }, [selectedPosition]);

  useEffect(() => {
    if (isMapReady && mapRef) {
      // add source and layer to map on init and ready
      mapRef.sources.add(dataSourceRef);
      mapRef.layers.add(layerRef);
    }
  }, [isMapReady]);

  const memoizedMapPopup = useMemo(
    () => (
      <AzureMapPopup
        isVisible={!!selectedPosition}
        options={{ position: selectedPosition }}
        popupContent={(
          <div style={{ padding: '10px' }}>
            <h3>{selectedDetail?.name}</h3>
            <a href={selectedDetail?.url} target="_blank" rel="noreferrer">
              {selectedDetail?.url}
            </a>
          </div>
        )}
      />
    ),
    [isMapReady, selectedPosition],
  );

  return (
    <Box>
      {memoizedHtmlMarkerRender}
      {memoizedMapPopup}
      <AzureMapHtmlMarker
        key={Math.random()}
        markerContent={<div><image width="40" src={pin} /></div>}
        options={{
          ...azureHtmlMapMarkerOptions(INITIAL_POSITION),
        }}
      />
    </Box>
  );
}

export default MapController;
