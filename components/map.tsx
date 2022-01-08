import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = () => {
  return (
    <MapContainer center={[45.4, -75.7]} zoom={12} scrollWheelZoom={true} className="h-96 w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
        <Marker position={[45.4, -75.7]}>
            <Popup>
                <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
            </Popup>
        </Marker>
    </MapContainer>
  );
}

//https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
//https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png

export default Map;