import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
const APIkey = 'bb88c96e978adf0da18c937d9b2e85d8';

function App() {
  
  const [coords, setCoords] = useState()
  const [weather, setWeather] = useState()
  const [temp, setTemp] = useState()
  const [isLoading, setIsLoading] = useState(true) 
  const [textInput, setTextInput] = useState('')
  const [finder, setFinder] = useState()
  const [hasError, setHasError] = useState(false)

  const success = position => {
    const obj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }
    setCoords(obj)
  }

  
  useEffect(() => {
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}`
      axios.get(url)
      .then(res => {
        const obj ={
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9/5) +32).toFixed(2)
          }
          setTemp(obj)
          setWeather(res.data)
        })
        .catch(err => console.log(err))
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [coords])
  
  useEffect(() => {
    if (textInput) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${APIkey}`
      axios.get(url)
      .then(res => {
        const obj ={
          celsius: (res.data.main.temp - 273.15).toFixed(2),
          fahrenheit: ((res.data.main.temp - 273.15) * (9/5) +32).toFixed(2)
        }
        setTemp(obj)
        setHasError(false)
        setFinder(res.data)
      })
      .catch(err => {
        setHasError(true)
        console.log(err)
      })  
      .finally(() => {
        setIsLoading(false)
      })
    }
  }, [textInput])
  
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success)
  }, [])

  let bgStyle = {};

  if (finder) {
    bgStyle = {
      backgroundImage: `url('../assets/backgrounds/${finder?.weather[0].icon}.png')`
    }
  } else {
    bgStyle = {
      backgroundImage: `url('../assets/backgrounds/${weather?.weather[0].icon}.png')`
    }
  }

  return (
    <div className='app' style={bgStyle}>
      {
        isLoading?
          <img className="loading" src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-11-849_512.gif" alt="loading" />
        :
          textInput?
            isLoading?
              <img className="loading" src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-11-849_512.gif" alt="loading" />
            :
              <WeatherCard
                weather = {finder}
                temp = {temp} 
                setTextInput = {setTextInput}
                hasError = {hasError}
              />
          :
            <WeatherCard
              weather = {weather}
              temp = {temp} 
              setTextInput = {setTextInput}
              hasError = {hasError}
            />
      }
    </div>
  )
}

export default App
