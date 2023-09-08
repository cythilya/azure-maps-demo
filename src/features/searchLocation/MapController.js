import {
  useContext,
  useEffect,
  useMemo,
  useState
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

const MapController = ({ selectedPosition, selectedDetail }) => {
  const { mapRef, isMapReady } = useContext(AzureMapsContext);
  const [htmlMarkers, setHtmlMarkers] = useState([selectedPosition || INITIAL_POSITION]);

  const azureHtmlMapMarkerOptions = () => {
    return {
      position: selectedPosition,
      title: selectedDetail?.name,
    };
  };

  const renderHTMLPoint = (coordinates) => {
    return (
      <AzureMapHtmlMarker
        isPopupVisible={true}
        key={Math.random()}
        markerContent={<div>{selectedDetail?.name || 'New York City Hall'}</div>}
        options={{...azureHtmlMapMarkerOptions(coordinates)}}
      />
    );
  }

  const memoizedHtmlMarkerRender = useMemo(() => {
    return htmlMarkers.map((marker) => renderHTMLPoint(marker))
  }, [htmlMarkers, selectedPosition]);

  useEffect(() => {
    changeMapCenter(selectedPosition);
  }, [selectedPosition]);

  const changeMapCenter = (selectedPosition) => {
    if (mapRef) {
      mapRef.setCamera({
        center: selectedPosition,
        zoom: 15
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
        isVisible={!!selectedPosition}
        options={{position: selectedPosition }}
        popupContent={
          <div style={{ padding: '10px' }}>
            <h3>{selectedDetail?.name}</h3>
            <a href={selectedDetail?.url} target="_blank">
              {selectedDetail?.url}
            </a>
          </div>
        }
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
      >
      </AzureMapHtmlMarker>
    </Box>
  );
};

export default MapController;
