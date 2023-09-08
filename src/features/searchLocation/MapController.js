import React, {
  useContext,
  useEffect,
  useState,
  useMemo
} from 'react';
import { AzureMapsContext, AzureMapHtmlMarker, AzureMapPopup, useCreatePopup, AzureMapFeature } from 'react-azure-maps';
import { layer, source, azureHtmlMapMarkerOptions } from 'azure-maps-control';
import { API_PATH, SUBSCRIPTION_KEY } from '../../app/constants';

const dataSourceRef = new source.DataSource();
const layerRef = new layer.SymbolLayer(dataSourceRef);
const INITIAL_POSITION = [-74.0060, 40.7128];
const MOCK_CENTER_POSITION = [121.5598, 25.09108];

const MapController = () => {
  const [data, setData] = useState(null);
  const [markers, setMarkers] = useState([INITIAL_POSITION]);
  const [htmlMarkers, setHtmlMarkers] = useState([INITIAL_POSITION]);
  const { mapRef, isMapReady } = useContext(AzureMapsContext);
  const markerPosition = INITIAL_POSITION ; // TODO: Latitude and Longitude of the marker

  const onClick = (e) => {
    console.log('You click on: ', e);
  };


  const memoizedHtmlMarkerRender = useMemo(
    () => htmlMarkers.map((marker) => renderHTMLPoint(marker)),
    [htmlMarkers],
  );
  const renderPoint = (coordinates) => {
    const rendId = Math.random();

    console.log('rendId', rendId)

    return (
      <AzureMapFeature
        type="Point"
        coordinates={INITIAL_POSITION}
        properties={{
          title: 'Marker Title',
          description: 'Marker Description'
        }}
        options={{
          iconOptions: {
            image: 'your_marker_icon_url.svg', // Replace with your custom marker icon URL
            allowOverlap: true,
            anchor: 'center',
            size: 1
          }
        }}
      />
      // <AzureMapFeature
      //   className={rendId}
      //   key={rendId}
      //   id={rendId.toString()}
      //   type="Point"
      //   coordinate={coordinates}
      //   properties={{
      //     title: 'Pin',
      //     icon: 'pin-round-blue',
      //   }}
      // />
    );
  };

  const memoizedMarkerRender = useMemo(
    ()  => markers.map((marker) => renderPoint(marker)),
    [markers],
  );


  const changeMapCenter = () => {
    if (mapRef) {
      mapRef.setCamera({
        center: MOCK_CENTER_POSITION,
        zoom: 17
      }); // TODO
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


  function renderHTMLPoint(coordinates){
    console.log('renderHTMLPoint')
    const rendId = Math.random();
    return (
      <AzureMapHtmlMarker
        markerContent={<div className="pulseIcon">Hello!</div>}
        options={{ ...azureHtmlMapMarkerOptions(coordinates) }}
        events={[{ eventName: 'click', callback: onClick }]}
        isPopupVisible={true}
        key={rendId}
      />
    );
  }

  function azureHtmlMapMarkerOptions(coordinates) {
    return {
      position: coordinates,
      text: 'My text',
      title: 'Title',
    };
  }

  const eventToMarker = [{ eventName: 'click', callback: onClick }];
  const rendId = Math.random();

  // show the list in search result
  return (
    <>
    {memoizedMarkerRender}
    {memoizedHtmlMarkerRender}
      <AzureMapHtmlMarker
          key={rendId}
          markerContent={<div className="pulseIcon">Hello</div>}
          options={{ ...azureHtmlMapMarkerOptions(INITIAL_POSITION) }}
          events={eventToMarker}
      >
        <div style={{ backgroundColor: 'red', padding: '5px', borderRadius: '5px', width: '100px', height: '100px' }}>
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

const styles = {
  map: {
    height: 300,
  },
  buttonContainer: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: '10px',
    gridAutoColumns: 'max-content',
    padding: '10px 0',
    alignItems: 'center',
  },
  button: {
    height: 35,
    width: 80,
    backgroundColor: '#68aba3',
    'text-align': 'center',
  },
};

export default MapController;
