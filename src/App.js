import React, { useState } from 'react';
import './App.css';
import LogoImg from './assets/_CloudGaze_Logo.png';
import LogoImgDark from './assets/_CloudGaze_Logo_Dark.png';

const weatherApi = {
  key: "01877eb0f113d4d0c163508453b2d61e",
  base: "https://api.openweathermap.org/data/2.5/"
};

const timeApiBase = "https://timeapi.io/api/Time/current/coordinate?";

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [localTime, setLocalTime] = useState('');
  const [isFetchingTime, setIsFetchingTime] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // New state for dark mode

  const search = evt => {
    if (evt.key === "Enter" || evt.type === "click") {
      fetch(`${weatherApi.base}weather?q=${query}&units=metric&APPID=${weatherApi.key}`)
        .then(res => res.json())
        .then(result => {
          if (result.cod !== "404") {
            setWeather(result);
            setQuery('');
            setIsFetchingTime(true);
            fetchLocalTime(result.coord.lat, result.coord.lon);
          } else {
            console.error("City not found");
          }
        })
        .catch(err => {
          console.error("Error fetching weather data: ", err);
        });
    }
  };

  const fetchLocalTime = (lat, lon) => {
    fetch(`${timeApiBase}latitude=${lat}&longitude=${lon}`)
      .then(res => res.json())
      .then(result => {
        setLocalTime(result.dateTime);
        setIsFetchingTime(false);
      })
      .catch(err => {
        console.error("Error fetching local time: ", err);
        setIsFetchingTime(false);
      });
  };

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  return (
    <div className={(typeof weather.main !== "undefined") ? 
      ((weather.main.temp <= 16) 
        ? `app cold ${isDarkMode ? 'dark-cold' : ''}` 
        : `app warm ${isDarkMode ? 'dark-warm' : ''}`)
      : `app ${isDarkMode ? 'dark' : ''}`}
    >
      <main>
        <div className="top-bar">
          <button className="dark-mode-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className="logo">
          <a href="/">
            <img src={isDarkMode ? LogoImgDark : LogoImg} alt="CloudGaze Logo" />
          </a>
        </div>

        <div className="searchBox">
          <input
            className="searchInput"
            type="text"
            placeholder="Search something"
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
          <button className="searchButton" onClick={search}> {/* trigger on button click */}
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
              <g clipPath="url(#clip0_2_17)">
                <g filter="url(#filter0_d_2_17)">
                  <path
                    d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    shapeRendering="crispEdges"
                  />
                </g>
              </g>
              <defs>
                <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                  <feOffset dy="4"></feOffset>
                  <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
                </filter>
                <clipPath id="clip0_2_17">
                  <rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"></rect>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>

        {(typeof weather.main !== "undefined") && (
          <div className="weather">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        )}

        {(typeof weather.main !== "undefined") && (
          <div className="local-time-box">
            <div className="local-time">
              Local Time: {isFetchingTime ? (
                <div className="container">
                  <span className="sun sunshine"></span>
                  <span className="sun"></span>
                </div>
              ) : (
                localTime ? new Date(localTime).toLocaleTimeString() : 'Error fetching time'
              )}
            </div>
            {/* Explore More Button */}
          </div>
        )}

        {/* Conditionally render the Explore More Bar */}
        {(typeof weather.main !== "undefined") && (
          <div className="explore-bar">
            <span className="explore-text">Explore more about {weather.name}</span>
            <button 
              className="explore-button" 
              onClick={() => window.open(`https://www.google.com/search?q=${weather.name}`, '_blank')}
            >
              &#8594;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
