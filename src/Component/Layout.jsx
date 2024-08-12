import axios from 'axios';
import React, { useEffect, useState } from 'react';
import clearImg from '../assets/clear.png';
import cloudImg from '../assets/cloud.png';
import drizzleImg from '../assets/drizzle.png';
import humidityImg from '../assets/humidity.png';
import rainImg from '../assets/rain.png';
import snowImg from '../assets/snow.png';
import windImg from '../assets/wind.png';
import { WiDayCloudyWindy } from "react-icons/wi";

export default function Layout() {
  const apiKey = '17bb2c93779368c2a9b01457bacf3cbe';
  const [city, setCity] = useState('delhi');
  const [data, setData] = useState({});
  const [hourlyData, setHourlyData] = useState([]);
  const [uvIndex, setUvIndex] = useState(null);

  const getWeatherDetails = (city) => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(weatherURL)
      .then((res) => {
        setData(res.data);
        // Fetch UV Index using latitude and longitude from the weather response
        const { lat, lon } = res.data.coord;
        const uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        axios.get(uvURL)
          .then((uvRes) => {
            setUvIndex(uvRes.data.value);
          })
          .catch((err) => {
            console.log('UV Index Error', err);
          });
      })
      .catch((err) => {
        console.log('Weather Error', err);
      });
  };

  const getHourlyWeatherDetails = (city) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiURL)
      .then((res) => {
        setHourlyData(res.data.list);
      })
      .catch((err) => {
        console.log('Hourly Weather Error', err);
      });
  };

  useEffect(() => {
    getWeatherDetails(city);
    getHourlyWeatherDetails(city);
  }, [city]);

  const handleSearch = () => {
    const cityInput = document.getElementById('city-input').value;
    setCity(cityInput);
  };

  const getWeatherImage = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) {
      return <img src={rainImg} alt="Rain" className="w-24 h-24 mx-auto" />;
    } else if (weatherId >= 300 && weatherId < 600) {
      return <img src={drizzleImg} alt="Drizzle" className="w-24 h-24 mx-auto" />;
    } else if (weatherId >= 600 && weatherId < 700) {
      return <img src={snowImg} alt="Snow" className="w-24 h-24 mx-auto" />;
    } else if (weatherId >= 700 && weatherId < 800) {
      return <img src={cloudImg} alt="Cloud" className="w-24 h-24 mx-auto" />;
    } else if (weatherId === 800) {
      return <img src={clearImg} alt="Clear" className="w-24 h-24 mx-auto" />;
    } else if (weatherId === 801 || weatherId === 802 || weatherId === 803) {
      return <img src={cloudImg} alt="Cloudy" className="w-24 h-24 mx-auto" />;
    } else {
      return <WiDayCloudyWindy className='text-8xl text-yellow-400' />;
    }
  };

  return (
    <div className={' bg-gradient-to-r from-blue-950 to-purple-900 min-h-screen flex flex-wrap gap-5 items-center justify-center font-serif text-white'}>
      {/*       <div className="image mx-5">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/welcome-board-3688623-3231454.png" alt="Person" className="w-96 h-96 rounded" />
      </div> */}
      <div className="text-center mx-5">
        <div className="mb-5 flex justify-center">
          <input
            type="text"
            id="city-input"
            name='city'
            placeholder="Enter city"
            className="p-2 rounded-md w-96 text-black"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2 ml-2 bg-yellow-400 text-white rounded-md font-bold"
          >
            Search
          </button>
        </div>
        <hr className='my-5 border-1 border-gray-200/50' />
        <div className="text-6xl font-bold my-5">{data?.name}</div>
        <div className="flex items-center justify-center mt-4">
          {data?.weather && getWeatherImage(data.weather[0].id)}
        </div>
        <div className="ml-4 text-6xl font-semibold">{data?.main?.temp}°C</div>
        <div className="text-2xl mt-3 tracking-wide font-bold">{data?.weather?.[0]?.description}</div>
        <div className='flex justify-center items-center gap-2'>
          <div className="flex items-center justify-center mt-4 rounded p-5">
            <img src={humidityImg} alt="Humidity" className="w-12 h-12 mx-2" />
            <span className="text-xl font-semibold">{data?.main?.humidity}% Humidity</span>
          </div>
          <div className="flex items-center justify-center mt-4 rounded p-5">
            <img src={windImg} alt="Wind" className="w-12 h-12 mx-2" />
            <span className="text-xl font-semibold">{data?.wind?.speed} m/s Wind</span>
          </div>
          <div className="flex items-center justify-center mt-4 rounded p-5">
            <img src='https://cdn-icons-png.flaticon.com/512/3262/3262984.png' alt="Wind" className="w-12 h-12 mx-2" />
            <span className="text-xl font-semibold">UV Index: {uvIndex}</span>
          </div>
        </div>
        <hr className='my-5 border-1 border-gray-200/50' />
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">Hourly Forecast</h2>
          <div className="flex justify-center items-center gap-5 overflow-x-auto">
            {hourlyData.slice(0, 5).map((hour, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-semibold mb-2">
                  {new Date(hour.dt_txt).getHours()}:00
                </div>
                {getWeatherImage(hour.weather[0].id)}
                <div className="text-xl mt-1 font-semibold">{hour.main.temp}°C</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
