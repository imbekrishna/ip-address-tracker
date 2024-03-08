import arrowIcon from "./assets/images/icon-arrow.svg";

function App() {
  return (
    <>
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
            <span>IP Address</span>
            <p>192.212.174.101</p>
          </div>
          <div className="ip-info-container">
            <span>Location</span>
            <p>Brooklyn, NY 10001</p>
          </div>
          <div className="ip-info-container">
            <span>Timezone</span>
            <p>UTC -05:00</p>
          </div>
          <div className="ip-info-container">
            <span>ISP</span>
            <p>SpaceX Starlink</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
