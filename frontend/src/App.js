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
    const [ssepQualityShow, setssepQualityShow] = useState(false)
    const [ssepShow, setssepShow] = useState(false)
    const [opacity] = useState(0.7)
    const zurichCenter = [47.3769, 8.5417];
    const [activeLegendUrl, setActiveLegendUrl] = useState(null);

    const FuzzyLegend = () => (
        <div>
            <div className="mb-2 fw-bold">Fuzzy Environment</div>
            <div className="d-flex align-items-center mb-1">
                <span style={{
                    width: 16,
                    height: 16,
                    backgroundColor: '#006400',
                    display: 'inline-block',
                    marginRight: 8,
                    border: '1px solid #333'
                }}/>
                <span>Very Good</span>
            </div>
            <div className="d-flex align-items-center mb-1">
                <span style={{
                    width: 16,
                    height: 16,
                    backgroundColor: '#7CFC00',
                    display: 'inline-block',
                    marginRight: 8,
                    border: '1px solid #333'
                }}/>
                <span>Good</span>
            </div>
            <div className="d-flex align-items-center mb-1">
                <span style={{
                    width: 16,
                    height: 16,
                    backgroundColor: '#FFFF00',
                    display: 'inline-block',
                    marginRight: 8,
                    border: '1px solid #333'
                }}/>
                <span>Liveable</span>
            </div>
            <div className="d-flex align-items-center mb-1">
                <span style={{
                    width: 16,
                    height: 16,
                    backgroundColor: '#FFA500',
                    display: 'inline-block',
                    marginRight: 8,
                    border: '1px solid #333'
                }}/>
                <span>Bad</span>
            </div>
            <div className="d-flex align-items-center">
                <span style={{
                    width: 16,
                    height: 16,
                    backgroundColor: '#FF0000',
                    display: 'inline-block',
                    marginRight: 8,
                    border: '1px solid #333'
                }}/>
                <span>Very Bad</span>
            </div>
        </div>
    );

    const SepLegend = () => (
        <div>
            <div className="mb-2 fw-bold">Swiss-SEP Index</div>

            <div className="small mb-3">
                Swiss Neighbourhood Index of Socioeconomic Position (Swiss-SEP).
                <br/>
                <strong>Low SEP:</strong> socioeconomically disadvantaged areas.
                <br/>
                <strong>High SEP:</strong> socioeconomically advantaged areas.
            </div>

            {/* Very Low */}
            <div className="d-flex align-items-center mb-1">
      <span style={{
          width: 16, height: 16, backgroundColor: '#B2182B', // red = low SEP
          display: 'inline-block', marginRight: 8, border: '1px solid #333'
      }}/>
                <span>Very Low (0–20) — very disadvantaged</span>
            </div>

            {/* Low */}
            <div className="d-flex align-items-center mb-1">
      <span style={{
          width: 16, height: 16, backgroundColor: '#FC4E2A',
          display: 'inline-block', marginRight: 8, border: '1px solid #333'
      }}/>
                <span>Low (21–40) — disadvantaged</span>
            </div>

            {/* Medium */}
            <div className="d-flex align-items-center mb-1">
      <span style={{
          width: 16, height: 16, backgroundColor: '#FD8D3C',
          display: 'inline-block', marginRight: 8, border: '1px solid #333'
      }}/>
                <span>Medium (41–60) — average socioeconomic position</span>
            </div>

            {/* High */}
            <div className="d-flex align-items-center mb-1">
      <span style={{
          width: 16, height: 16, backgroundColor: '#6BAED6',
          display: 'inline-block', marginRight: 8, border: '1px solid #333'
      }}/>
                <span>High (61–80) — advantaged</span>
            </div>

            {/* Very High */}
            <div className="d-flex align-items-center">
      <span style={{
          width: 16, height: 16, backgroundColor: '#08306B', // blue = high SEP
          display: 'inline-block', marginRight: 8, border: '1px solid #333'
      }}/>
                <span>Very High (81–100) — very advantaged</span>
            </div>
        </div>
    );


    const SsepQualityLegend = () => (
        <div>
            <div className="mb-2 fw-bold">Difference Score (0–100)</div>

            <div className="small mb-3">
                Measures the mismatch between the Swiss Neighbourhood Index of Socioeconomic Position (Swiss-SEP)
                and fuzzy living quality.
                <br/>
                <strong>Low value:</strong> SEP and living quality are similar.
                <br/>
                <strong>High value:</strong> large difference between SEP and living quality (in either direction).
            </div>

            {/* Very Low */}
            <div className="d-flex align-items-center mb-1">
          <span style={{
              width: 16, height: 16, backgroundColor: '#0000FF',
              display: 'inline-block', marginRight: 8, border: '1px solid #333'
          }}/>
                <span>Very Low (0–20) — SEP & quality very similar</span>
            </div>

            {/* Low */}
            <div className="d-flex align-items-center mb-1">
          <span style={{
              width: 16, height: 16, backgroundColor: '#00A0FF',
              display: 'inline-block', marginRight: 8, border: '1px solid #333'
          }}/>
                <span>Low (21–40) — small difference</span>
            </div>

            {/* Medium */}
            <div className="d-flex align-items-center mb-1">
          <span style={{
              width: 16, height: 16, backgroundColor: '#00FFFF',
              display: 'inline-block', marginRight: 8, border: '1px solid #333'
          }}/>
                <span>Medium (41–60) — moderate difference</span>
            </div>

            {/* High */}
            <div className="d-flex align-items-center mb-1">
          <span style={{
              width: 16, height: 16, backgroundColor: '#FFFF00',
              display: 'inline-block', marginRight: 8, border: '1px solid #333'
          }}/>
                <span>High (61–80) — strong difference</span>
            </div>

            {/* Very High */}
            <div className="d-flex align-items-center">
          <span style={{
              width: 16, height: 16, backgroundColor: '#FF0000',
              display: 'inline-block', marginRight: 8, border: '1px solid #333'
          }}/>
                <span>Very High (81–100) — maximum SEP–quality mismatch</span>
            </div>
        </div>
    );


    const setLegendFor = (key, checked) => {
        if (!checked) {
            setActiveLegendUrl(null);
            return;
        }
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
            case 'fuzzy':
                setActiveLegendUrl(null);
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
        setssepQualityShow(layer === 'ssepQualityShow' ? checked : false);
        setssepShow(layer === 'ssepShow' ? checked : false);
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
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="ssepQualityShow"
                                checked={ssepQualityShow}
                                onChange={handleToggle('ssepQualityShow')}
                            />
                            <label className="form-check-label" htmlFor="ssepQualityShow">
                                ssep-Quality
                            </label>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="ssepShow"
                                checked={ssepShow}
                                onChange={handleToggle('ssepShow')}
                            />
                            <label className="form-check-label" htmlFor="ssepShow">
                                Swiss-SEP Index
                            </label>
                        </div>
                    </div>
                </div>
                {(activeLegendUrl || fuzzyShow) && (
                    <div className="card position-absolute z-1 bottom-0 end-0 m-3">
                        <div className="card-body">
                            {activeLegendUrl ? (
                                <img src={activeLegendUrl} alt="Legende"/>
                            ) : (
                                <FuzzyLegend/>
                            )}
                        </div>
                    </div>
                )}
                {(ssepQualityShow) && (
                    <div className="card position-absolute z-1 bottom-0 end-0 m-3">
                        <div className="card-body">
                            <SsepQualityLegend/>
                        </div>
                    </div>
                )}
                {(ssepShow) && (
                    <div className="card position-absolute z-1 bottom-0 end-0 m-3">
                        <div className="card-body">
                            <SepLegend/>
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
                    {ssepQualityShow && (
                        <WMSTileLayer
                            url="http://localhost:8080/geoserver/fuzzy_zurich/wms"
                            layers="fuzzy_zurich:ssep_quality"
                            styles="fuzzy_zurich:sep_quality"
                            format="image/png"
                            transparent={true}
                            version="1.3.0"
                            attribution="© Your Local GeoServer"
                            opacity={opacity}
                        />
                    )}
                    {ssepShow && (
                        <WMSTileLayer
                            url="http://localhost:8080/geoserver/fuzzy_zurich/wms"
                            layers="fuzzy_zurich:ssep"
                            styles="fuzzy_zurich:sep_style"
                            format="image/png"
                            transparent={true}
                            version="1.3.0"
                            attribution="© Your Local GeoServer"
                            opacity="1.0"
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
