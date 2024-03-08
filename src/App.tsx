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
  const [search, setSearch] = useState<string>("");
  const [searchType, setSearchType] = useState<"ipAddress" | "domain">(
    "ipAddress"
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const address = `${data?.location.city}, ${data?.location.country}, ${data?.location.postalCode}`;

  const fetchData = useCallback(
    function () {
      setLoading(true);
      fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${
          import.meta.env.VITE_IPIFY_KEY
        }&${searchType}=${search}`
      )
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    },
    [search, searchType]
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
      setSearch(query);
    } else {
      setError("Wrong address format! Try again.");
    }
  }

  function checkIpAddress(address: string) {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    const domainPattern =
      /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

    const isIP = ipv4Pattern.test(address) || ipv6Pattern.test(address);
    const isDomain = domainPattern.test(address);
    const isValid = isIP || isDomain;

    if (isValid && isIP) {
      setSearchType("ipAddress");
    }
    if (isValid && isDomain) {
      setSearchType("domain");
    }

    return isValid;
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
              value={data?.ip}
              loading={loading}
            />
            <InfoContainer label="Location" value={address} loading={loading} />
            <InfoContainer
              label="Timezone"
              value={`UTC ${data?.location.timezone}`}
              loading={loading}
            />
            <InfoContainer label="ISP" value={data?.isp} loading={loading} />
          </>
        </div>
      </div>
      {data && (
        <MapContainer
          key={data.location.lat}
          id="map"
          center={[data.location.lat, data.location.lng]}
          zoom={13}
          scrollWheelZoom={false}
          zoomControl={false}
          dragging={false}
        >
          <TileLayer
            attribution="Google Maps"
            url="https://www.google.com/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          />
          <Marker
            position={[data.location.lat, data.location.lng]}
            icon={L.icon({
              iconUrl: markerIcon,
            })}
          >
            <Popup>
              {data.as.name}, <br /> {address}, <br /> {data.ip}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </main>
  );
}

export default App;
