import {MapContainer, TileLayer, WMSTileLayer} from 'react-leaflet';
import {useState} from "react";

function App() {
  const [streetPollutionShow, setStreetPollutionShow] = useState(true)
  const center = [46.8182, 8.2275]; // Switzerland


  return (
    <div className="h-full w-full">
        <div className="h-screen w-screen position-relative">
            <div className="card position-absolute z-1 top-0 end-0 m-3">
                <div className="card-body">
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="streetPollution" checked={streetPollutionShow} onChange={(e) => setStreetPollutionShow(e.target.checked)} />
                        <label className="form-check-label" htmlFor="streetPollution">Street Pollution</label>
                    </div>
                </div>
            </div>
            <MapContainer center={center} zoom={8} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {streetPollutionShow && (
                    <WMSTileLayer
                        url="http://localhost:8080/geoserver/wms"
                        layers="ne:strassenlaerm_tag"  // workspace:layername
                        format="image/png"
                        transparent={true}
                        attribution="Strassenlaerm Data"
                        opacity={0.7}
                        styles="strassenlaerm_tag_colormap"
                    />
                )}

            </MapContainer>
        </div>
    </div>
  );
}

export default App;
