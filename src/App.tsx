import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import arrowIcon from "./assets/images/icon-arrow.svg";
import React, { useEffect, useState, useCallback } from "react";

export interface QueryResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

function App() {
  const [data, setData] = useState<QueryResponse | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const address = `${data?.city}, ${data?.countryCode}, ${data?.zip}`;

  const fetchData = useCallback(
    function () {
      fetch(`http://ip-api.com/json/${input}`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error(err));
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

  function getTimezoneOffset(tz: string) {
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

  if (!data) {
    return <p>loading...</p>;
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
              <img src={arrowIcon} alt="" />
            </button>
          </form>
          <p className={`error-message ${error ? "error" : ""}`}>{error}</p>
        </div>
        <div className="ip-info-div">
          <div className="ip-info-container">
            <div className="info-wrapper">
              <span>IP Address</span>
              <p>{data.query}</p>
            </div>
          </div>
          <div className="ip-info-container">
            <div className="info-wrapper">
              <span>Location</span>
              <p>{address}</p>
            </div>
          </div>
          <div className="ip-info-container">
            <div className="info-wrapper">
              <span>Timezone</span>
              <p>{getTimezoneOffset(data.timezone)}</p>
            </div>
          </div>
          <div className="ip-info-container">
            <div className="info-wrapper">
              <span>ISP</span>
              <p>{data.isp}</p>
            </div>
          </div>
        </div>
      </div>
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
        <Marker position={[data.lat, data.lon]}>
          <Popup>
            {data.isp}, <br /> {address}, <br /> {data.query}
          </Popup>
        </Marker>
      </MapContainer>
    </main>
  );
}

export default App;
