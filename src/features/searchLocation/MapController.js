import React, {
  useContext,
  useEffect,
  useState
} from 'react';
import { AzureMapsContext, AzureMapHtmlMarker } from 'react-azure-maps';
import { layer, source, azureHtmlMapMarkerOptions } from 'azure-maps-control';
import { API_PATH, SUBSCRIPTION_KEY } from '../../app/constants';

const dataSourceRef = new source.DataSource();
const layerRef = new layer.SymbolLayer(dataSourceRef);
const INITIAL_POSITION = [40.712784779958255, -74.00600910186768];
const MOCK_CENTER_POSITION = [121.5598, 25.09108];

const MapController = () => {
  const [data, setData] = useState(null);
  const { mapRef, isMapReady } = useContext(AzureMapsContext);
  const markerPosition = INITIAL_POSITION ; // TODO: Latitude and Longitude of the marker

  const changeMapCenter = () => {
    if (mapRef) {
      mapRef.setCamera({ center: MOCK_CENTER_POSITION }); // TODO
    }
  };

  useEffect(() => {
    if (isMapReady && mapRef) {
      // add source and layer to map on init and ready
      mapRef.sources.add(dataSourceRef);
      mapRef.layers.add(layerRef);
    }
  }, [isMapReady]);

  // fetch query list by keyword
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_PATH.SEARCH}&` + new URLSearchParams({
        'subscription-key': SUBSCRIPTION_KEY,
        query: 'pizza',
        lat: 40.712784779958255,
        lon: -74.00600910186768,
        view: 'Auto'
      }));

      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);
  console.log('data', data); // TODO

  const onClick = (e) => {
    console.log('You click on: ', e);
  };

  function renderHTMLPoint(coordinates){
    const rendId = Math.random();
    return (
      <AzureMapHtmlMarker
        key={rendId}
        markerContent={<div className="pulseIcon">Hello!</div>}
        options={{ ...azureHtmlMapMarkerOptions(coordinates) }}
        events={[{ eventName: 'click', callback: onClick }]}
      />
    );
  }

  // show the list in search result
  return (
    <>
      <AzureMapHtmlMarker
        className="AzureMapHtmlMarker"
          key={'1'}
          markerContent={<div className="pulseIcon"></div>}
          options={markerPosition}
          // events={eventToMarker}
      >
        <div style={{ backgroundColor: 'red', padding: '5px', borderRadius: '5px' }}>
          This is a marker
        </div>
      </AzureMapHtmlMarker>
      {
        data && (
          <ul>
            {data.results.map((item, index) => (
              <li key={index} onClick={changeMapCenter}>{item.poi.name}</li>
            ))}
          </ul>
        )
      }
    </>
  );
};

export default MapController;
