import {MapContainer, TileLayer, WMSTileLayer} from 'react-leaflet';
import {useState} from "react";

function App() {
    const [year, setYear] = useState(2023);
  const [noisePollutionShow, setNoisePollutionShow] = useState(true)
  const [airPollutionShow, setAirePollutionShow] = useState(false)
  const [socioShow, setSocioShow] = useState(false)
  const [pm10Show, setPm10Show] = useState(false)
  const center = [46.8182, 8.2275]; // Switzerland


  return (
    <div className="h-full w-full">
        <div className="h-screen w-screen position-relative">
            <div className="card position-absolute z-1 top-0 end-0 m-3">
                <div className="card-body">
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="streetPollution" checked={noisePollutionShow} onChange={(e) => setNoisePollutionShow(e.target.checked)} />
                        <label className="form-check-label" htmlFor="streetPollution">Noise Pollution</label>
                    </div>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="socio" checked={socioShow} onChange={(e) => setSocioShow(e.target.checked)} />
                        <label className="form-check-label" htmlFor="socio">Socio-Economic Disadvantage</label>
                    </div>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="airPollution" checked={airPollutionShow} onChange={(e) => setAirePollutionShow(e.target.checked)} />
                        <label className="form-check-label" htmlFor="airPollution">Air Pollution</label>
                    </div>
                    <div className="form-check form-switch mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="pm10"
                            checked={pm10Show}
                            onChange={(e) => setPm10Show(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="pm10">
                            PM10
                        </label>
                    </div>
                </div>
            </div>
            <MapContainer center={center} zoom={8} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {noisePollutionShow && (
                    <WMSTileLayer
                        url="http://localhost:8080/geoserver/wms"
                        layers="urban:strassenlaerm_tag"  // workspace:layername
                        format="image/png"
                        transparent={true}
                        attribution="Strassenlaerm Data"
                        opacity={0.7}
                        styles="strassenlaerm_tag_colormap"
                    />
                )}
                {airPollutionShow && (
                    <WMSTileLayer
                        url="http://localhost:8080/geoserver/wms"
                        layers="urban:air_pollution_nitrogen_dioxide"
                        format="image/png"
                        transparent={true}
                        attribution="Air Pollution (NO2)"
                        opacity={0.7}
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
                        opacity={0.8}
                    />
                )}
            </MapContainer>
        </div>
    </div>
  );
}

export default App;
