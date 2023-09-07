import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AzureMapsContext,
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapHtmlMarker,
  AzureMapLayerProvider,
  AzureMapsProvider,
  IAzureDataSourceChildren,
  IAzureMapFeature,
  IAzureMapHtmlMarkerEvent,
  IAzureMapLayerType,
  IAzureMapOptions,
} from 'react-azure-maps';
import { data, layer, source, AuthenticationType, HtmlMarkerOptions, SymbolLayerOptions } from 'azure-maps-control';

const dataSourceRef = new source.DataSource();
const layerRef = new layer.SymbolLayer(dataSourceRef);

const MapController = () => {
  const [data, setData] = useState(null);
  const key = process.env['REACT_APP_SUBSCRIPTION_KEY'];


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://atlas.microsoft.com/search/poi/json?api-version=1.0&subscription-key=${key}&query=pizza&lat=40.712784779958255&lon=-74.00600910186768&view=Auto`
      );
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  console.log('data', data)

  const handleOnClick = () => {
    console.log('handleOnClick')
  }


  let map, datasource, client, popup, searchInput, resultsPanel, searchInputLength, centerMapOnResults;

  // Here you use mapRef from context
  const { mapRef, isMapReady } = useContext(AzureMapsContext);
  const [showTileBoundaries, setShowTileBoundaries] = useState(true);

  const changeMapCenter = () => {
    if (mapRef) {
      // Simple Camera options modification
      mapRef.setCamera({ center: getRandomPosition() });
    }
  };

  useEffect(() => {
    if (mapRef) {
      // Simple Style modification
      mapRef.setStyle({ showTileBoundaries: !showTileBoundaries });
    }
  }, [showTileBoundaries]);

  const toggleTitleBoundaries = () => {
    setShowTileBoundaries((prev) => !prev);
  };

  const searchInputKeyup = (e) => {
    centerMapOnResults = false;

    if (e.keyCode === 13) {
        centerMapOnResults = true;
        search()
    }
  };

  const search = () => {
    var query = document.getElementById("search-input").value;
    console.log('query', query)
    //Remove any previous results from the map.
    // datasource.clear();

    //Use MapControlCredential to share authentication between a map control and the service module.
    var pipeline = Window.atlas.service.MapsURL.newPipeline(new Window.atlas.service.MapControlCredential(map));

    //Construct the SearchURL object
    var searchURL = new Window.atlas.service.SearchURL(pipeline);

    searchURL.searchPOI(Window.atlas.service.Aborter.timeout(10000), query, {
      lon: map.getCamera().center[0],
      lat: map.getCamera().center[1],
      maxFuzzyLevel: 4,
      view: 'Auto'
  }).then((results) => {

      //Extract GeoJSON feature collection from the response and add it to the datasource
      var data = results.geojson.getFeatures();
      datasource.add(data);

      if (centerMapOnResults) {
          map.setCamera({
              bounds: data.bbox
          });
      }
      console.log(data);
    });
  };

  useEffect(() => {
    if (isMapReady && mapRef) {
      // Need to add source and layer to map on init and ready
      mapRef.sources.add(dataSourceRef);
      mapRef.layers.add(layerRef);
    }
  }, [isMapReady]);

  // Util function to add pin
  const addRandomMarker = () => {
    const randomLongitude = Math.floor(Math.random() * (180 - -180) + -180);
    const randomLatitude = Math.floor(Math.random() * (-90 - 90) + 90);
    const newPoint = new data.Position(randomLongitude, randomLatitude);

    dataSourceRef.add(new data.Feature(new data.Point(newPoint)));
  };

  return (
    <>
      <div style={styles.buttonContainer}>
        <button size="small" variant="contained" color="primary" onClick={toggleTitleBoundaries}>
          Toggle Title Boundaries
        </button>
        <button size="small" variant="contained" color="primary" onClick={changeMapCenter}>
          button Map Center
        </button>
        <button size="small" variant="contained" color="primary" onClick={addRandomMarker}>
          Add Pin
        </button>
      </div>
      <div id="search">
      <div className="search-input-box">
          <div className="search-input-group">
              <div className="search-icon" type="button"></div>
              <input
                id="search-input"
                type="text"
                placeholder="Search"
                onKeyDown={searchInputKeyup}
              />
          </div>
      </div>
      {data && (
        <ul>
          {data.results.map((item, index) => (
            <li key={index} onClick={handleOnClick}>{item.poi.name}</li>
          ))}
        </ul>
      )}
      <ul id="results-panel"></ul>
  </div>
    </>
  );
};

// Util Function to generate random position
const getRandomPosition = () => {
  const randomLongitude = Math.floor(Math.random() * (180 - -180) + -180);
  const randomLatitude = Math.floor(Math.random() * (-90 - 90) + 90);
  return [randomLatitude, randomLongitude];
};

// Some styles
const styles = {
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
  },
};

export default MapController;
