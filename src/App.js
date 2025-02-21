"use client";

import Image from "next/image";
//import styles from "./page.module.css";
import './app/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { formattedWeatherDataObj } from "./weatherData";
import { weatherCode } from "./weatherCode";

window.addEventListener('load', (event) => {
  console.log('All elements, including images and stylesheets, are fully loaded.');
  // code to run
  console.log('PAGE LOADED!!!!!!!!');
});

//const dataObj = await formattedWeatherDataObj(); // Wait for the async function to resolve
const weatherCodeData = new weatherCode();

//console.log('Final Weather Data:', dataObj);

const getDay = (dateString) => {

  const date = new Date(dateString);

  // Get the weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const weekdayIndex = date.getDay();

  // Optionally, you can map the index to a weekday name
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
  const weekdayName = weekdays[weekdayIndex];

  //console.log(`The weekday for ${dateString} is ${weekdayName}.`);

  return weekdayName;
} 

const getDateMatches = (dateString, dataArray) => {

// Extract the date part (YYYY-MM-DD)
const dateToMatch = dateString.split('T')[0]; // "2025-01-31"

// Find all objects that match the extracted date
const matchingObjects = dataArray.filter(obj => obj.time.split('T')[0] === dateToMatch);

//console.log('getDateMatches:', matchingObjects);

return matchingObjects;

}

const convertTime = (dateTimeString) => {
      // Extract the time part from the string
      const timePart = dateTimeString.split('T')[1]; // "18:00"
      const [hours] = timePart.split(':').map(Number); // Get only the hours
  
      // Convert to 12-hour format
      const isPM = hours >= 12;
      const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
      const suffix = isPM ? 'PM' : 'AM';
  
      // Return only the hour in 12-hour format with suffix
      return `${hours12} ${suffix}`;
}

const getWeatherCodeData = (code) => {
  return weatherCodeData.getWeatherCode(code)
}

const getWeatherIcon = (obj, wObj) => { //wObj is the weather code data obj - obj is the weather data
  //console.log('is_day:', obj.is_day, 'obj:', obj);
  try{
    if (obj.is_day === 0) {
      return wObj.image.night;
    } else {
      return wObj.image.day;
    }
  } 
  catch(error) {console.log('getWeatherIcon error:', error); return 'images/sun.png';}

};
//----------- GET LOCATION FUNCTION --------------//
const getLocation = async () => {
  if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  resolve(position);
              },
              (error) => {
                  console.error("Error getting location:", error);
                  // Return a default location if permission is denied or an error occurs
                  const defaultLocation = {
                      coords: {
                          latitude: 52.5244,  // Default latitude 
                          longitude: 13.4105  // Default longitude 
                      }
                  };
                  resolve(defaultLocation);
              }
          );
      });
  } else {
      console.log("Geolocation is not supported by this browser.");
      // Return a default location if geolocation is not supported
      return {
          coords: {
              latitude: 40.7128,  // Default latitude
              longitude: -74.0060  // Default longitude
          }
      };
  }
};
// ---------- REVERSE GEOCODING FUNCTION -----------//
const reverseGeoCode = async (lat, long) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`; // Changed to 'json' for easier handling

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json(); // Await the JSON parsing
    console.log('reverseGeoCode response:', data); // Log the actual data
    return data; // Return the parsed data
  } catch (error) {
    console.error('Error fetching reverse geocode:', error); // Log the error
    throw error; // Rethrow the error if needed
  }
};
//----------- GEOCODE BY ZIP OR NAME ---------------------//
const searchLocation = async (zipCode) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zipCode)}&format=json`);
  const data = await response.json();

  if (data.length > 0) {
      const { lat, lon } = data[0]; // Get the first result
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return { coords: {
        latitude: lat, 
        longitude: lon }
      };
  } else {
      console.log("Location not found.");
      return null;
  }
};
// ---------- GET API RESULTS FUNCTION -----------//
const getApiResults = async (url) => {
  const response = await fetch(url);
  // Check if the response is ok (status code 200-299)
  if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
  }
  // Parse the JSON from the response
  return response.json();
};
// ---------- HANDLE LOCAL STORAGE FUNCTIONS -----------//
const setLocalStorage = (key, value, setError) => {
  if (localStorage.length < 5) {
    // Check if the key already exists in localStorage
    if (localStorage.getItem(key) !== null) {
      console.error('Key already exists in local storage:', key);
      setError('Location already saved.');
      return;
    }
    // If the key does not exist, set the item in localStorage
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    console.error('Local storage limit reached. Cannot add more items.');
    setError('Maximum number of saved locations reached (5).');
  }
};


const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

const removeLocalStorage = (key) => {
  localStorage.removeItem(key);
}

const getAllLocalStorage = () => {
  const keys = Object.keys(localStorage);
  return keys.map(key => {
      return {
          key,
          value: JSON.parse(localStorage.getItem(key))
      };
  });
}

const AppContext = createContext();
const CurrentContext = createContext();
const DailyContext = createContext();
const HourlyContext = createContext();
const ApiContext = createContext();

const ApiContextProvider = ({ children }) => {
  console.log('ApiContextProvider mounted...');

  const [ loading, setLoading ] = useState(true);
  const [ location, setLocation ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ value, setValue ] = useState(null);
  const [ currentWeather, setCurrentWeather ] = useState(null);
  const [ hourlyArray, setHourlyArray ] = useState([]);
  const [ dailyArray, setDailyArray ] = useState([]);
  const [ todaysConditions, setTodaysConditions ] = useState(null);
  const [ userLocation, setUserLocation ] = useState(null);
  const [ selectedUnits, setSelectedUnits ] = useState('imperial');
  const [ unitsObj, setUnitsObj ] = useState(null);
  const [ locationToSave, setLocationToSave ] = useState(null);
  const [ savedLocations, setSavedLocations ] = useState(() => getAllLocalStorage());
  const isFetchingRef = useRef(false);

  const imperialUnits = '&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch';
  const metricUnits = '';

  useEffect(() => {
    console.log('useEffect running...');
    if (isFetchingRef.current) return; // Prevent multiple calls
    isFetchingRef.current = true; // Set fetching to true
    setLoading(true); // Start loading

    const fetchData = async () => {
      try {
          // ---------- UNITS OBJ ----------//
          const units = selectedUnits === 'imperial' ? imperialUnits : metricUnits;
  
          const currentLocation = !userLocation ? await getLocation() : userLocation; // obj containing lat and long
          console.log('current location:', currentLocation); 

          if (!currentLocation) {
              console.error("Could not retrieve location.");
              return; // Exit if location is not available
          }

          const locationData = await reverseGeoCode(currentLocation.coords.latitude, currentLocation.coords.longitude);
          console.log('location data:', locationData);
          const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.coords.latitude}&longitude=${currentLocation.coords.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&minutely_15=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,visibility,is_day&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,cloud_cover,visibility,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant${units}&timezone=auto&forecast_days=14&forecast_minutely_15=4`;
  
          const apiData = await getApiResults(apiUrl);
          const dataObj = await formattedWeatherDataObj(apiData);
          const city = locationData.address.city ? locationData.address.city : locationData.address.town ?
              locationData.address.town : locationData.address.village ? locationData.address.village : 
              locationData.address.county ? locationData.address.county : locationData.address.state? 
              locationData.address.state : null;
          const locationDataObj = {
              city: city,
              id: locationData.osm_type + '-' + locationData.osm_id,
              coordinates: {
                latitude: locationData.lat,
                longitude: locationData.lon
              },
              address: {...locationData.address}
          };
          // Set the state with the fetched data
          setLocationToSave(locationDataObj);
          setLocation(city);
          setCurrentWeather(dataObj.current);
          setDailyArray(dataObj.daily);
          setHourlyArray(dataObj.hourly);
          setTodaysConditions(dataObj.todaysConditions); 
          console.log('api context - state values:', 'current:', dataObj.current, 'daily:', dataObj.daily, 
              'hourly:', dataObj.hourly);
          if (selectedUnits === 'imperial') {
              setUnitsObj({
                  temperature: '°F',
                  windSpeed: 'mph',
                  precipitation: 'in'
              });
          } else {
              setUnitsObj({
                  temperature: '°C',
                  windSpeed: 'km/h',
                  precipitation: 'mm'
              });
          }
      } catch (err) {
          setError(err.message);
          console.error('Error fetching data:', err);
      } finally {
          setLoading(false); // Set loading to false after data is fetched
          isFetchingRef.current = false; // Reset fetching state
      }
  };

        fetchData(); // Call the async function inside useEffect
      
  }, [ selectedUnits, userLocation ]); // dependencies array

  return (
    <ApiContext.Provider value={{ value, location, loading, error, currentWeather, hourlyArray, dailyArray, 
    todaysConditions, selectedUnits, unitsObj, locationToSave, savedLocations, setSavedLocations, setSelectedUnits, setUserLocation, setError}}>
      {children}
    </ApiContext.Provider>
  );
};

const AppContextProvider = ({ children }) => {
  const [ currentVisible, setCurrentVisible ] = useState(true);
  const [ dailyVisible, setDailyVisible ] = useState(false);
  const [ hourlyVisible, setHourlyVisible ] = useState(false);
  const [ selectedDayVisible, setSelectedDayVisible ] = useState(false);
  const [ selectedHourVisible,setSelectedHourVisible ] = useState(false);
  const [ selectedDayObj, setSelectedDayObj ] = useState(null);
  const [ selectedHourObj, setSelectedHourObj ] = useState(null);

  useEffect(() => {
    if (selectedDayObj !== null) {
      setSelectedDayVisible(true);
    } else {
      setSelectedDayVisible(false);
    }
  }, [ selectedDayObj ]);

  useEffect(() => {
    if (selectedHourObj !== null) {
      setSelectedHourVisible(true);
    } else {
      setSelectedHourVisible(false);
    }
  }, [ selectedHourObj ]) 

  return (
    <AppContext.Provider value={{currentVisible, setCurrentVisible, 
      dailyVisible, setDailyVisible, 
      hourlyVisible, setHourlyVisible, 
      selectedDayObj, setSelectedDayObj, 
      selectedDayVisible, setSelectedDayVisible, 
      selectedDayObj, setSelectedDayObj, 
      selectedHourVisible,setSelectedHourVisible,
      selectedHourObj, setSelectedHourObj}}>
      {children}
    </AppContext.Provider>
  )
}

const CurrentContextProvider = ({ children }) => {
  const { currentWeather } = useContext(ApiContext);
  const [ value, setValue ] = useState(currentWeather || []);
  //console.log('CurrentContext - current:', currentWeather);
  return (
    <CurrentContext.Provider value={{value, setValue}}>
      {children}
    </CurrentContext.Provider>
  )
}

const DailyContextProvider = ({ children }) => {
  const { dailyArray } = useContext(ApiContext);
  const [ dailyData, setDailyData ] = useState(dailyArray || []);

  //console.log('daily data:', dailyData);

  return (
    <DailyContext.Provider value={{dailyData}}>
      {children}
    </DailyContext.Provider>
  )
}

const HourlyContextProvider = ({ children }) => {
  const { hourlyArray } = useContext(ApiContext);
  const [value, setValue] = useState(hourlyArray || []);

  useEffect(() => {
    setValue(hourlyArray);
  }, [hourlyArray]); // Update value when hourlyArray changes

  return (
    <HourlyContext.Provider value={{ value }}>
      {children}
    </HourlyContext.Provider>
  );
};

export default function App() {
 
  return (
    <div className='background-container d-flex flex-column min-h-100 w-100 py-0 mb-auto'>
      <div className="background-grad flex-fill min-h-100">
      <ApiContextProvider> 
        <AppContextProvider>
          <MainAppWrapper />   
        </AppContextProvider>
      </ApiContextProvider>
      </div>
    </div>
  );
}

const MainAppWrapper = () => {
  const { currentVisible, selectedDayVisible, selectedHourVisible } = useContext(AppContext);
  const { loading, location, locationToSave, setSavedLocations, error, setError } = useContext(ApiContext);
  console.log('error:', error);
  const date = new Date();
  const saveLocation = (location) => {
    setLocalStorage(location.id, location, setError);
    setSavedLocations(() => getAllLocalStorage());
    console.log('location saved:', localStorage.getItem(location.id));
  }
  if (loading) {
    return (
      <div className='d-flex container-fluid text-white justify-content-center align-items-center' style={{width: 100 + 'vw', height: 100 + 'vh', backgroundColor: 'rgba(0,0,0,1)'}}> 
        <div className="spinner-border text-info" role="status" style={{width: 10 + 'rem', height: 10 + 'rem', borderWidth: 0.7 + 'rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  } else {
    return (
      <main className='d-flex flex-column text-white'>
        {error && (
        <div aria-live="polite" aria-atomic="true" className="bg-dark position-relative bd-example-toasts">
          <div className="toast-container position-absolute p-3 top-0 start-50 translate-middle-x" id="toastPlacement">
            <div className="toast show bg-danger">
              <div className="toast-body d-flex flex-row justify-content-between">
                  <div className="d-flex justify-content-between">
                    {error}
                  </div>
                  <button type="button" className="btn-close btn-close-white ms-auto" data-bs-dismiss="toast" onClick={() => setError(null)} aria-label="Close"></button>
              </div>
            </div>
          </div>
        </div>
        )}
        <div className="d-flex flex-row justify-content-between align-items-center p-3">
          <div className="p-3">
            <h2 className="mb-2">{location === null ? "Berlin" : location}</h2>
            {(!selectedDayVisible && !selectedHourVisible) && 
            (<p>{date.toLocaleDateString('en-US', 
            { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit'})}</p>)}
          </div>
          <button className="btn btn-outline-light btn-sm ms-auto me-1" 
          type="button" onClick={() => saveLocation(locationToSave)}><i className="bi bi-save"></i></button>
          <Menu />
        </div>
        <div className="mw-100vw">
          <CurrentContextProvider>
            <DailyContextProvider>
              {currentVisible && <CurrentWeather />}
            </DailyContextProvider>
          </CurrentContextProvider>
          {selectedDayVisible && <SelectedDay />}
          {selectedHourVisible && <SelectedHour />}
        </div>
      </main>
    );
  }

}

const Menu = () => {
  const [ inputValue, setInputValue ] = useState('');
  const { selectedUnits, setSelectedUnits, setUserLocation, savedLocations, 
        setSavedLocations } = useContext(ApiContext);
  const selectedValue = useRef(selectedUnits);
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log('search submitted:', inputRef.current.value);
    const searchResults = await searchLocation(inputRef.current.value);
    console.log('search results:', searchResults);
    setUserLocation(searchResults);
    event.target.value = '';
  }

  const handleSelect = (event) => {
    console.log('selected:', event.target.value);
    const value = event.target.value;
    selectedValue.current = value;
    setSelectedUnits(value);
  }

  const handleRemove = (key) => {
    console.log('remove id:', key);
    removeLocalStorage(key);
    setSavedLocations(() => getAllLocalStorage());
  }

  const useSavedLocation = async(key) => {
    console.log('use saved location:', key);
    const location = await getLocalStorage(key);
    console.log('location:', location);
    const locationObj = {coords: {...location.coordinates}};
    setUserLocation(locationObj);
  }
  
  return (
    <div>
      <button className="btn btn-outline-light btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" aria-controls="offcanvasExample">
        <i className='bi bi-gear'></i>
      </button>
      <div className="offcanvas offcanvas-start bg-dark text-white" tabIndex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasLabel">Settings</h5>
          <button type="button" className="btn-close text-reset btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <label htmlFor="unitsSelect" className="form-label">Select units:</label>
          <select className="form-select mb-3" value={selectedValue.current} onChange={handleSelect} id="unitsSelect" aria-label="Choose measurement units">
            <option value="imperial">Imperial</option>
            <option value="metric">Metric</option>
          </select>
          <div className="input-group mb-3">
            <input type="text" className="form-control" ref={inputRef} placeholder="Seach by city or zip code" aria-label="Search by city of zip code" />
            <button className="btn btn-outline-light" type="submit" onClick={handleSubmit}>Search</button>
          </div>

          <div className="d-flex flex-column mb-3">
            <p className="mb-3 mt-5">Saved Locations:</p>
            <ul className="list-unstyled overflow-y-auto mb-0">
              
              { savedLocations.map((item, index) => {
                console.log('item:', item);
                return (
                  <li key={index} className="d-flex flex-row card bg-secondary text-white justify-content-between align-items-center p-1 mb-1">
                    <p className="mb-0 ms-1 flex-fill" onClick={() => useSavedLocation(item.key)}>{item.value.city}</p><button className="btn btn-danger btn-sm" onClick={() => {handleRemove(item.key)}}>
                      <i className="bi bi-x"></i>
                    </button>
                  </li>
                );
              }) }
            </ul>
            <p className="text-white"><small><em>Up to 5 locations max.</em></small></p>
          </div>


          <div className="mt-auto text-white">
            <p className="mb-1"><small>Weather data powered by <a href="https://open-meteo.com/" className="text-light" target="_blank" rel="noopener noreferrer">Open-Meteo.com</a></small></p>
            <p className="mb-1"><small>Geocoding powered by <a href="https://www.openstreetmap.org" className="text-light" target="_blank" rel="noopener noreferrer">OpenStreetMap.org</a></small></p>
          </div>
        </div>
      </div>
    </div>
  );
}

const SelectedDay = () => {
  const { selectedDayObj, setCurrentVisible, setSelectedDayVisible, setSelectedDayObj } = useContext(AppContext);
  const { unitsObj } = useContext(ApiContext);
  const date = new Date(selectedDayObj.time)
  const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', weekday: 'short' });
  //console.log('selectedDay data:', selectedDayObj);
  const BackToCurrent = () => {
    setSelectedDayObj(null);
    setSelectedDayVisible(false);
    setCurrentVisible(true);
  };
  return (
    <div className="d-flex flex-column px-3">
    <div className="m-auto container-lg mw-960px h-max-c card glass text-white mt-0 px-3 py-2 mb-5">
      <h2 className="mb-4">Conditions for: {formattedDate}</h2>
      <div className="d-flex flex-md-row flex-column w-auto">
        <ul className="list-unstyled col-md-6 col-12 listItemBorder mb-0 p-0 pe-2">
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
            src='/images/hot.png' 
            className="me-1 mw-img" 
            height={512} 
            width={512} 
            style={{objectFit: 'contain', height: 'auto'}} 
            alt="weather icon" />
            <p className="ms-2 my-auto">High</p>
            <p className='ms-auto fw-bold'>{parseInt(selectedDayObj.temperature_2m_max)}°</p>
          </li>
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
              src='/images/cold.png' 
              className="me-1 mw-img" 
              height={512} 
              width={512} 
              style={{objectFit: 'contain', height: 'auto'}} 
              alt="weather icon" />
            <p className="ms-2 my-auto">Low</p>
            <p className='ms-auto fw-bold'>{parseInt(selectedDayObj.temperature_2m_min)}°</p>
          </li>
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
                src='/images/sunrise.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
            <p className="ms-2 my-auto">Sunrise</p>
            <p className='ms-auto fw-bold'>{convertTime(selectedDayObj.sunrise)}</p>
          </li>
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
                src='/images/sunset.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
            <p className="ms-2 my-auto">Sunset</p>
            <p className='ms-auto fw-bold'>{convertTime(selectedDayObj.sunset)}</p>
          </li>
        </ul>
        <ul className='list-unstyled col-md-6 col-12 listItemBorder listItemBorderAll mb-0 p-0'>
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
                src='/images/sunclouds.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
              <p className="ms-2 my-auto">UV Index</p>
              <p className='ms-auto fw-bold'>{selectedDayObj.uv_index_max}</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
                src='/images/humidity.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
              <p className="ms-2 my-auto">Precip %</p>
              <p className='ms-auto fw-bold'>{selectedDayObj.precipitation_probability_max}%</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
                src='/images/drop.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
              <p className="ms-2 my-auto">Precip Total</p>
              <p className='ms-auto fw-bold'>{selectedDayObj.precipitation_sum} {unitsObj.precipitation}</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
                src='/images/wind-flag.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}}
                alt="weather icon" />
              <p className="ms-2 my-auto">Wind</p>
              <p className='ms-auto fw-bold'>{selectedDayObj.wind_speed_10m_max} {unitsObj.windSpeed}</p>
            </li>
        </ul>
      </div>
    </div>
      <button className='btn btn-outline-light mx-auto container-lg mw-960px' onClick={BackToCurrent}>Back To Current Weather</button>
    </div>
  );
}

const SelectedHour = () => {
  const { setCurrentVisible, selectedHourObj, setSelectedHourObj, setSelectedHourVisible } = useContext(AppContext);
  const { unitsObj } = useContext(ApiContext);
  console.log('SelectedHour data:', selectedHourObj);
  const weatherCodeObj = getWeatherCodeData(selectedHourObj.weather_code);
  const weatherIcon = getWeatherIcon(selectedHourObj, weatherCodeObj);
  const date = new Date(selectedHourObj.time);
  const BackToCurrent = () => {
    setSelectedHourObj(null);
    setSelectedHourVisible(false);
    setCurrentVisible(true);
  };
  return (
    <div className="d-flex flex-column p-3">
      <div className="d-flex flex-column card glass mb-5 text-white container-lg mw-960px">
        <h3 className="text-start mx-2 mt-4">Conditions for: <span className="fw-bold">{convertTime(selectedHourObj.time)}</span></h3>
        <p className="mx-2">{date.toLocaleDateString('en-US', 
            { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
        <div className="d-flex flex-md-row flex-column">
          <div className="d-flex flex-row col-md-6 col-12 p-5 justify-content-center align-items-center"> 
            <Image 
            src={weatherIcon} 
            className="me-3" 
            height={512} 
            width={512} 
            style={{width: 'auto', height: 'auto', objectFit: 'contain', maxWidth: 50+'%'}} 
            alt="weather icon" />
            <p className="fs-vw-1">{parseInt(selectedHourObj.temperature_2m)}</p>
         </div>
          <div className="d-flex m-auto col-md-5 justify-content-center align-items-center text-center text-white p-5">
            <div className="d-flex flex-column fs-3 fw-light my-auto">
              <p>{weatherCodeObj.description}</p>
              <p>Feels like {parseInt(selectedHourObj.apparent_temperature)}°</p>
            </div>
          </div>
        </div>
        <div className="d-flex row p-3">
          <ul className="list-unstyled col-md-6 col-12 listItemBorder mb-0 p-0 px-2">
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
              src='/images/sunclouds.png' 
              className="me-1 mw-img" 
              height={512} 
              width={512} 
              style={{objectFit: 'contain', height: 'auto'}} 
              alt="weather icon" />
              <p className="ms-2 my-auto">Humidity</p>
              <p className='ms-auto fw-bold'>{parseInt(selectedHourObj.relative_humidity_2m)}%</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
              src='/images/drop.png' 
              className="me-1 mw-img" 
              height={512} 
              width={512} 
              style={{objectFit: 'contain', height: 'auto'}} 
              alt="weather icon" />
              <p className="ms-2 my-auto">Precipitation</p>
              <p className='ms-auto fw-bold'>{parseInt(selectedHourObj.precipitation)} {unitsObj.precipitation}</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
              src='/images/humidity.png' 
              className="me-1 mw-img" 
              height={512} 
              width={512} 
              style={{objectFit: 'contain', height: 'auto'}} 
              alt="weather icon" />
              <p className="ms-2 my-auto">Precipitation %</p>
              <p className='ms-auto fw-bold'>{parseInt(selectedHourObj.precipitation_probability)}%</p>
            </li>
          </ul>
          <ul className="list-unstyled col-md-6 col-12 listItemBorder listItemBorderAll mb-0 p-0 px-2">
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
              src='/images/rainbow.png' 
              className="me-1 mw-img" 
              height={512} 
              width={512} 
              style={{objectFit: 'contain', height: 'auto'}} 
              alt="weather icon" />
              <p className="ms-2 my-auto">Visibility</p>
              <p className='ms-auto fw-bold'>{parseInt(selectedHourObj.visibility)} m</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
              src='/images/wind-flag.png' 
              className="me-1 mw-img" 
              height={512} 
              width={512} 
              style={{objectFit: 'contain', height: 'auto'}} 
              alt="weather icon" />
              <p className="ms-2 my-auto">Wind</p>
              <p className='ms-auto fw-bold'>{parseInt(selectedHourObj.wind_speed_10m)} {unitsObj.windSpeed}</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
              src='/images/doublecloud.png' 
              className="me-1 mw-img" 
              height={512} 
              width={512} 
              style={{objectFit: 'contain', height: 'auto'}} 
              alt="weather icon" />
              <p className="ms-2 my-auto">Cloud cover</p>
              <p className='ms-auto fw-bold'>{parseInt(selectedHourObj.cloud_cover)}%</p>
            </li>
          </ul>
        </div>
      </div>
      <button className='btn btn-outline-light container-lg mw-960px' onClick={BackToCurrent}>Back To Current Weather</button>
    </div>
  )
}

const CurrentWeather = () => {
  const { value } = useContext(CurrentContext);
  const { dailyData } = useContext(DailyContext)
  const { unitsObj } = useContext(ApiContext);
  const weatherCodeObj = getWeatherCodeData(value.weather_code);
  const weatherIcon = getWeatherIcon(value, weatherCodeObj);
  const hiTemp = parseInt(dailyData[0].temperature_2m_max);
  const lowTemp = parseInt(dailyData[0].temperature_2m_min);

  //console.log('CURRENT TEMP VALUE IS:', value.temperature_2m, 'context value:', value, 'weather code obj:', weatherIcon);

  return(
    <div className="d-flex row text-white h-100 p-3" id="currentWeatherWrapper">
      <div className="p-3">
        <div className="d-flex flex-md-row flex-column card glass p-2 mb-5">
          <div className="d-flex flex-row col-md-6 col-12 p-2 justify-content-center text-white align-items-center"> 
            <Image 
            src={weatherIcon} 
            className="me-3" 
            height={512} 
            width={512} 
            style={{width: 'auto', height: 'auto', objectFit: 'contain', maxWidth: 50+'%'}} 
            alt="weather icon" />
            <p className="fs-vw-1">{parseInt(value.temperature_2m)}{unitsObj.temperature}</p>
          </div>
          <div className="d-flex ms-auto col-md-5 col-12 justify-content-start align-items-center text-center text-white p-2">
            <div className="d-flex flex-column fs-3 fw-light m-auto">
              <p>{weatherCodeObj.description}</p>
              <p>{hiTemp}°/{lowTemp}°</p>
              <p className="mb-0">Feels like {parseInt(value.apparent_temperature)}°</p>
            </div>
          </div>
        </div>
      </div>


      <HourlyContextProvider>
        <HourlyWeather />
      </HourlyContextProvider>
      <div>
        <CurrentContextProvider>
          <TodaysConditions />
        </CurrentContextProvider>
        <DailyContextProvider>
          <ExtendedForecast />
        </DailyContextProvider>
      </div>

      
    </div>
  )
}

const HourlyWeather = () => {
  const { value } = useContext(HourlyContext);
  const { setSelectedHourObj, setCurrentVisible } = useContext(AppContext);
  const { currentWeather, setCurrentWeather } = useContext(ApiContext);
  const [ hoverIndex, setHoverIndex ] = useState(false);
  const currentHours = getDateMatches(currentWeather.time, value);
  const SetHourlyObject = (index) => {
    setSelectedHourObj(() => {
      console.log(`the selectedHourObj for ${index} is:`, value[index]);
      return currentHours[index];
    })
  }

  console.log('hourly weather value:', value);

  return (
    <div className="d-flex flex-column px-0 w-auto mb-5 ps-3">
      <h2 className="mb-3">Hourly Weather</h2>
      <ul className='list-unstyled d-flex flex-row gap-2 mb-0 p-0 py-3 overflow-x-auto hidescrollbar 
      hidescrollbar-ff hidescrollbar::-webkit-scrollbar'>
        {Array.isArray(currentHours) && currentHours.map((item, index) => {
          //console.log('hourly map item:', item);
          const weatherCodeObj = getWeatherCodeData(item.weather_code);
          const weatherIcon = getWeatherIcon(item, weatherCodeObj);
          return (
            <li key={index} 
            className={`card d-flex flex-column flex-grow p-3 glass text-white 
              justify-content-center text-center w-10vw ${hoverIndex === index ? 'hovered' : ''}`} 
            onMouseEnter={() => {setHoverIndex(index)}} 
            onMouseLeave={() => {setHoverIndex(null)}}
            onClick={() => {setCurrentVisible(false); SetHourlyObject(index);}}>
              <p className="my-2">{convertTime(item.time)}</p>
              <Image 
              src={weatherIcon} 
              className="mx-auto w-50 my-2" 
              height={512} 
              width={512} 
              layout='responsive' 
              alt="weather icon" />
              <p className='my-2'>{parseInt(item.temperature_2m)}°</p>
            </li>
          )
        })}
      </ul>      
    </div>

  );
}

const TodaysConditions = () => {
  const { value } = useContext(CurrentContext);
  const { dailyData } = useContext(DailyContext);
  const { unitsObj } = useContext(ApiContext);
  const currentDay = dailyData[0];
  //console.log('TodaysConditions - currentDay:', currentDay)
  return (
    <div className="m-auto container-sm h-max-c card glass text-white mt-0 px-3 py-2 mb-5">
      <h2>Today's Conditions</h2>
      <div className="d-flex flex-column flex-lg-row w-auto">
        <ul className="list-unstyled col-lg-6 col-12 listItemBorder mb-0 p-0 pe-2">
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
            src='/images/hot.png' 
            className="me-1 mw-img" 
            height={512} 
            width={512} 
            style={{objectFit: 'contain', height: 'auto'}} 
            alt="weather icon" />
            <p className="ms-2 my-auto">High</p>
            <p className='ms-auto fw-bold'>{parseInt(currentDay.temperature_2m_max)}°</p>
          </li>
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
              src='/images/cold.png' 
              className="me-1 mw-img" 
              height={512} 
              width={512} 
              style={{objectFit: 'contain', height: 'auto'}} 
              alt="weather icon" />
            <p className="ms-2 my-auto">Low</p>
            <p className='ms-auto fw-bold'>{parseInt(currentDay.temperature_2m_min)}°</p>
          </li>
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
                src='/images/sunrise.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
            <p className="ms-2 my-auto">Sunrise</p>
            <p className='ms-auto fw-bold'>{convertTime(currentDay.sunrise)}</p>
          </li>
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
                src='/images/sunset.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
            <p className="ms-2 my-auto">Sunset</p>
            <p className='ms-auto fw-bold'>{convertTime(currentDay.sunset)}</p>
          </li>
        </ul>
        <ul className='list-unstyled col-lg-6 col-12 listItemBorder listItemBorderAll mb-0 p-0'>
          <li className="d-flex flex-row align-items-center py-2">
            <Image 
                src='/images/sunclouds.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
              <p className="ms-2 my-auto">UV Index</p>
              <p className='ms-auto fw-bold'>{currentDay.uv_index_max}</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
                src='/images/humidity.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
              <p className="ms-2 my-auto">Precip %</p>
              <p className='ms-auto fw-bold'>{currentDay.precipitation_probability_max}%</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
                src='/images/drop.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}} 
                alt="weather icon" />
              <p className="ms-2 my-auto">Precip Total</p>
              <p className='ms-auto fw-bold'>{currentDay.precipitation_sum} {unitsObj.precipitation}</p>
            </li>
            <li className="d-flex flex-row align-items-center py-2">
              <Image 
                src='/images/wind-flag.png' 
                className="me-1 mw-img" 
                height={512} 
                width={512} 
                style={{objectFit: 'contain', height: 'auto'}}
                alt="weather icon" />
              <p className="ms-2 my-auto">Wind</p>
              <p className='ms-auto fw-bold'>{currentDay.wind_speed_10m_max} {unitsObj.windSpeed}</p>
            </li>
        </ul>
      </div>
    </div>

  );
}

const ExtendedForecast = () => {
  const [ seeMore, setSeeMore ] = useState(false); //local state
  const { dailyData, setDailyData } = useContext(DailyContext);
  const { setCurrentVisible, setSelectedDayObj } = useContext(AppContext);
  const sevenDay = dailyData.slice(0, 6);
  const array = seeMore ? dailyData : sevenDay;
  console.log('ExtendedForecast - dailyData:', dailyData);
  const expanded = useRef(false);
  const handleExpand = () => {
    if (expanded.current) {
      setSeeMore(false);
      expanded.current = false;
    } else {
      setSeeMore(true);
      expanded.current = true;
    }
  }
  const SetDailyObject = (index) => {
    setSelectedDayObj(() => {
      //console.log(`the selectedDayObj for ${index} is:`, array[index]);
      return array[index];
    })
  }
  
  return (
    <div className="m-auto container-md mw-960px">
      <div className="d-flex flex-row row">
        <h2 className="mb-3">Extended Forecast</h2>
        <ul className="list-unstyled col-12 gap-2 p-0">
          {array.map((item, index) => {
            //console.log('ExtendedForecast map func:', item)
            const weatherCodeObj = getWeatherCodeData(item.weather_code);
            const weatherIcon = getWeatherIcon(item, weatherCodeObj);
            return (
              <li key={index} 
              className="card glass px-3 py-4 d-flex flex-row align-items-center text-white mb-2" onClick={() => {setCurrentVisible(false); console.log('day clicked...'); SetDailyObject(index);}}>
                <Image 
                  src={weatherIcon} 
                  className="me-3 mw-img" 
                  height={512} 
                  width={512} 
                  layout='responsive' 
                  alt="weather icon" />
                <p className="ms-2 mb-0">{getDay(item.time)}</p>
                <p className='ms-auto mb-0 fs-2'>{parseInt(item.temperature_2m_max)}°/{parseInt(item.temperature_2m_min)}°</p></li>
            );
          })}
        </ul>
        <button className="btn btn-outline-light mb-3" onClick={handleExpand}>{expanded.current ? 'See less' : 'See more'}</button>
    </div>
  </div>
  );
}