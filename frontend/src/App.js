import {MapContainer, TileLayer, WMSTileLayer} from 'react-leaflet';
import {useState} from "react";

function App() {
  const [year, setYear] = useState(2023);
  const [russYear, setRussYear] = useState(2020);
  const [pm10Show, setPm10Show] = useState(false)
  const [pm25Show, setPm25Show] = useState(false)
  const [no2Show, setNo2Show] = useState(false)
  const [ozonShow, setOzonShow] = useState(false)
  const [russShow, setRussShow] = useState(false)
  const [laermShow, setLaermShow] = useState(false)
  const [fuzzyShow, setFuzzyShow] = useState(false)
  const [opacity] = useState(0.7)
  const zurichCenter = [47.3769, 8.5417];
  const [activeLegendUrl, setActiveLegendUrl] = useState(null);

  const setLegendFor = (key, checked) => {
    if (!checked) {
      setActiveLegendUrl(null);
      return;
    }
    //TODO: Fuzzy legend
    switch (key) {
      case 'pm10':
          setActiveLegendUrl(`https://wms.zh.ch/AwelLHPM10JahreZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=pm10-jahre-${year}&format=image/png&STYLE=default`);
          return;
      case 'pm25':
          setActiveLegendUrl(`https://wms.zh.ch/AwelLHPM25JahreZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=pm25-jahre-${year}&format=image/png&STYLE=default`);
          return;
      case 'no2':
          setActiveLegendUrl(`https://wms.zh.ch/AwelLHNO2JahreZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=no2-jahre-${year}&format=image/png&STYLE=default`);
          return;
      case 'ozon':
          setActiveLegendUrl(`https://wms.zh.ch/AwelLHMP98JahreZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mp98-jahre-${year}&format=image/png&STYLE=default`);
          return;
      case 'russ':
          setActiveLegendUrl(`https://wms.zh.ch/ImmissionenZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=bc-${russYear}&format=image/png&STYLE=default`);
          return;
      case 'laerm':
          setActiveLegendUrl(`https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=ch.bafu.laerm-strassenlaerm_tag&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0`);
          return;
      default:
          setActiveLegendUrl(null);
          return;
    }
  };

  const handleToggle = (layer) => (e) => {
    const checked = e.target.checked;
    setPm10Show(layer === 'pm10' ? checked : false);
    setPm25Show(layer === 'pm25' ? checked : false);
    setNo2Show(layer === 'no2' ? checked : false);
    setOzonShow(layer === 'ozon' ? checked : false);
    setRussShow(layer === 'russ' ? checked : false);
    setLaermShow(layer === 'laerm' ? checked : false);
    setFuzzyShow(layer === 'fuzzy' ? checked : false);
    setLegendFor(layer, checked);
  };


  return (
    <div className="h-full w-full">
        <div className="h-screen w-screen position-relative">
            <div className="card position-absolute z-1 top-0 end-0 m-3">
                <div className="card-body">
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="pm10"
                            checked={pm10Show}
                            onChange={handleToggle('pm10')}
                        />
                        <label className="form-check-label" htmlFor="pm10">
                            PM10
                        </label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="pm25"
                            checked={pm25Show}
                            onChange={handleToggle('pm25')}
                        />
                        <label className="form-check-label" htmlFor="pm25">
                            PM2.5
                        </label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="no2"
                            checked={no2Show}
                            onChange={handleToggle('no2')}
                        />
                        <label className="form-check-label" htmlFor="no2">
                            NO2
                        </label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="ozon"
                            checked={ozonShow}
                            onChange={handleToggle('ozon')}
                        />
                        <label className="form-check-label" htmlFor="ozon">
                            Ozon
                        </label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="russ"
                            checked={russShow}
                            onChange={handleToggle('russ')}
                        />
                        <label className="form-check-label" htmlFor="russ">
                            Russ
                        </label>
                    </div>

                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="laerm"
                            checked={laermShow}
                            onChange={handleToggle('laerm')}
                        />
                        <label className="form-check-label" htmlFor="laerm">
                            Strassenlärm
                        </label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="fuzzy"
                            checked={fuzzyShow}
                            onChange={handleToggle('fuzzy')}
                        />
                        <label className="form-check-label" htmlFor="fuzzy">
                            Fuzzy Environment
                        </label>
                    </div>
                </div>
            </div>
            {activeLegendUrl && (
                <div className="card position-absolute z-1 bottom-0 end-0 m-3">
                    <div className="card-body">
                        <img src={activeLegendUrl} alt="Legende" />
                    </div>
                </div>
            )}
            <MapContainer center={zurichCenter} zoom={10} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {fuzzyShow && (
                    <WMSTileLayer
                        url="http://localhost:8080/geoserver/fuzzy_zurich/wms"
                        layers="fuzzy_zurich:zurich_fuzzy_quality"
                        styles="fuzzy_zurich:zurich_fuzzy_quality_colored"
                        format="image/png"
                        transparent={true}
                        version="1.3.0"
                        attribution="© Your Local GeoServer"
                        opacity={opacity}
                    />
                )}
                {pm10Show && (
                    <WMSTileLayer
                        url="https://wms.zh.ch/AwelLHPM10JahreZHWMS"
                        layers={`pm10-jahre-${year}`}
                        format="image/png"
                        transparent={true}
                        version="1.3.0"
                        attribution="© AWEL Kanton Zürich"
                        opacity={opacity}
                    />
                )}
                {pm25Show && (
                    <WMSTileLayer
                        url="https://wms.zh.ch/AwelLHPM25JahreZHWMS"
                        layers={`pm25-jahre-${year}`}
                        format="image/png"
                        transparent={true}
                        version="1.3.0"
                        attribution="© AWEL Kanton Zürich"
                        opacity={opacity}
                    />
                )}
                {no2Show && (
                    <WMSTileLayer
                        url="https://wms.zh.ch/AwelLHNO2JahreZHWMS"
                        layers={`no2-jahre-${year}`}
                        format="image/png"
                        transparent={true}
                        version="1.3.0"
                        attribution="© AWEL Kanton Zürich"
                        opacity={opacity}
                    />
                )}
                {ozonShow && (
                    <WMSTileLayer
                        url="https://wms.zh.ch/AwelLHMP98JahreZHWMS"
                        layers={`mp98-jahre-${year}`}
                        format="image/png"
                        transparent={true}
                        version="1.3.0"
                        attribution="© AWEL Kanton Zürich"
                        opacity={opacity}
                    />
                )}
                {russShow && (
                    <WMSTileLayer
                        url="https://wms.zh.ch/ImmissionenZHWMS"
                        layers={`bc-${russYear}`}
                        format="image/png"
                        transparent={true}
                        version="1.3.0"
                        attribution="© AWEL Kanton Zürich"
                        opacity={opacity}
                    />
                )}
                {laermShow && (
                    <WMSTileLayer
                        url="https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0"
                        layers={`ch.bafu.laerm-strassenlaerm_tag`}
                        format="image/png"
                        transparent={true}
                        version="1.3.0"
                        attribution="© BAFU / geo.admin.ch"
                        opacity={opacity}
                    />
                )}
            </MapContainer>
        </div>
    </div>
  );
}

export default App;
