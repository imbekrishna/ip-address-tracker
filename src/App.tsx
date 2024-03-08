import L from "leaflet";
import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import arrowIcon from "./assets/images/icon-arrow.svg";
import markerIcon from "./assets/images/icon-location.svg";
import InfoContainer from "./components/InfoContainer";
import Spinner from "./components/Spinner";
import { QueryResponse } from "./types";

function App() {
  const [data, setData] = useState<QueryResponse | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const address = `${data?.city}, ${data?.countryCode}, ${data?.zip}`;

  const fetchData = useCallback(
    function () {
      setLoading(true);
      fetch(`http://ip-api.com/json/${input}`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    },
    [input]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      query: { value: string };
    };
    const query = target.query.value;
    const validIp = checkIpAddress(query);

    if (query === "" || validIp) {
      setInput(query);
    } else {
      setError("Wrong address format! Try again.");
    }
  }

  function getTimezoneOffset(tz: string | undefined = "Asia/Kolkata") {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      timeZoneName: "longOffset",
    };
    const dateText = Intl.DateTimeFormat([], options).format(new Date());
    console.log(dateText);

    const timeZoneString = dateText.split(" ")[1].replace(/GMT/, "UTC ");
    return timeZoneString;
  }

  function checkIpAddress(address: string) {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    const domainPattern =
      /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
    return (
      ipv4Pattern.test(address) ||
      ipv6Pattern.test(address) ||
      domainPattern.test(address)
    );
  }

  return (
    <main>
      <div className="info-container">
        <h1 className="title">IP Address Tracker</h1>
        <div className="form-wrapper">
          <form className="ip-input-div" onSubmit={handleSubmit}>
            <input
              type="text"
              name="query"
              onFocus={() => setError(null)}
              placeholder="Search for any IP address or domain"
            />
            <button className="btn" type="submit">
              {loading ? <Spinner /> : <img src={arrowIcon} alt="" />}
            </button>
          </form>
          <p className={`error-message ${error ? "error" : ""}`}>{error}</p>
        </div>
        <div className={`ip-info-div ${error ? "error" : ""}`}>
          <>
            <InfoContainer
              label="IP Address"
              value={data?.query}
              loading={loading}
            />
            <InfoContainer label="Location" value={address} loading={loading} />
            <InfoContainer
              label="Timezone"
              value={getTimezoneOffset(data?.timezone)}
              loading={loading}
            />
            <InfoContainer label="ISP" value={data?.isp} loading={loading} />
          </>
        </div>
      </div>
      {data && (
        <MapContainer
          key={data.lat}
          id="map"
          center={[data.lat, data.lon]}
          zoom={13}
          scrollWheelZoom={false}
          zoomControl={false}
          dragging={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[data.lat, data.lon]}
            icon={L.icon({
              iconUrl: markerIcon,
            })}
          >
            <Popup>
              {data.isp}, <br /> {address}, <br /> {data.query}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </main>
  );
}

export default App;
