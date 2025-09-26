import { MapContainer, TileLayer } from 'react-leaflet';

function App() {
  const center = [46.8182, 8.2275]; // Switzerland
  return (
    <div className="h-full w-full">
      <div className="h-screen w-screen">
        <MapContainer center={center} zoom={8} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
