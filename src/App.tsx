import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import arrowIcon from "./assets/images/icon-arrow.svg";

function App() {
  return (
    <main>
      <div className="info-container">
        <h1 className="title">IP Address Tracker</h1>
        <div className="ip-input-div">
          <input
            type="text"
            placeholder="Search for any IP address or domain"
          />
          <button className="btn">
            <img src={arrowIcon} alt="" />
          </button>
        </div>
        <div className="ip-info-div">
          <div className="ip-info-container">
            <div className="info-wrapper">
              <span>IP Address</span>
              <p>192.212.174.101</p>
            </div>
          </div>
          <div className="ip-info-container">
            <div className="info-wrapper">
              <span>Location</span>
              <p>Brooklyn, NY 10001</p>
            </div>
          </div>
          <div className="ip-info-container">
            <div className="info-wrapper">
              <span>Timezone</span>
              <p>UTC -05:00</p>
            </div>
          </div>
          <div className="ip-info-container">
            <div className="info-wrapper">
              <span>ISP</span>
              <p>SpaceX Starlink</p>
            </div>
          </div>
        </div>
      </div>
      <MapContainer
        id="map"
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </main>
  );
}

export default App;
