import {
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import Box from '@mui/material/Box';
import {
  AzureMapFeature,
  AzureMapHtmlMarker,
  AzureMapPopup,
  AzureMapsContext,
} from 'react-azure-maps';
import { layer, source } from 'azure-maps-control';
import { INITIAL_POSITION } from '../../app/constants';
import pin from './location-pin.png';

const dataSourceRef = new source.DataSource();
const layerRef = new layer.SymbolLayer(dataSourceRef);

const MapController = ({ selectedPosition, selectedDetail }) => {
  const { mapRef, isMapReady } = useContext(AzureMapsContext);
  const [markers, setMarkers] = useState([selectedPosition || INITIAL_POSITION]);
  const [htmlMarkers, setHtmlMarkers] = useState([selectedPosition || INITIAL_POSITION]);

  const onClick = (e) => {
    console.log('You click on the pin!');
  };

  const azureHtmlMapMarkerOptions = (coordinates) => {
    return {
      position: coordinates,
      text: 'My text',
      title: 'Title',
    };
  };

  const renderHTMLPoint = (coordinates) => {
    return (
      <AzureMapHtmlMarker
        events={[{ eventName: 'click', callback: onClick }]}
        isPopupVisible={true}
        key={Math.random()}
        markerContent={<div>{selectedDetail?.name || 'New York City Hall'}</div>}
        options={{...azureHtmlMapMarkerOptions(coordinates)}}
      />
    );
  }

  const memoizedHtmlMarkerRender = useMemo(() => {
    console.log('memoizedHtmlMarkerRender')
    return htmlMarkers.map((marker) => renderHTMLPoint(marker))
  }, [htmlMarkers, selectedPosition]);

  useEffect(() => {
    changeMapCenter(selectedPosition);
  }, [selectedPosition]);

  const changeMapCenter = (selectedPosition) => {
    if (mapRef) {
      mapRef.setCamera({
        center: selectedPosition,
        zoom: 17
      });
    }
  };

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
        isVisible={true}
        options={{position: INITIAL_POSITION}}
        popupContent={
          <div style={{ padding: '10px' }}>
            <h3>{selectedDetail?.name || 'New York City Hall'}</h3>
            <a href={selectedDetail?.url || 'sample.com.tw'} target="_blank">
              {selectedDetail?.url || 'sample.com.tw'}
            </a>
          </div>
        }
      />
    ),
    [isMapReady, selectedPosition],
  );

  // show the list in search result
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
          events={[{ eventName: 'click', callback: onClick }]}
      >
        <div style={{ backgroundColor: 'red', padding: '5px', borderRadius: '5px', width: '100px', height: '100px' }}>
          This is a marker
        </div>
      </AzureMapHtmlMarker>
    </Box>
  );
};

export default MapController;
