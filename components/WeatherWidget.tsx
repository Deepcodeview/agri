'use client'
import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react'

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    location: 'Punjab, India',
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: 'Today', temp: 28, condition: 'sunny', rain: 10 },
      { day: 'Tomorrow', temp: 26, condition: 'cloudy', rain: 40 },
      { day: 'Wed', temp: 24, condition: 'rainy', rain: 80 },
      { day: 'Thu', temp: 27, condition: 'sunny', rain: 5 }
    ]
  })

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />
      default: return <Sun className="w-6 h-6 text-yellow-500" />
    }
  }

  const getWeatherAlert = () => {
    const highRainDays = weather.forecast.filter(day => day.rain > 60).length
    if (highRainDays >= 2) {
      return {
        type: 'warning',
        message: 'Heavy rain expected. Apply fungicide to prevent crop diseases.'
      }
    }
    return null
  }

  const alert = getWeatherAlert()

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900">Weather Forecast</h3>
        <div className="text-sm text-neutral-500">{weather.location}</div>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-3xl font-bold text-neutral-900">{weather.temperature}°C</div>
          <div className="text-neutral-600">{weather.condition}</div>
        </div>
        <div className="text-right">
          <Cloud className="w-12 h-12 text-gray-500 mb-2" />
          <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600">
            <div className="flex items-center">
              <Droplets className="w-4 h-4 mr-1" />
              {weather.humidity}%
            </div>
            <div className="flex items-center">
              <Wind className="w-4 h-4 mr-1" />
              {weather.windSpeed} km/h
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alert */}
      {alert && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
          <div className="flex items-center text-yellow-800">
            <CloudRain className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      {/* 4-Day Forecast */}
      <div className="grid grid-cols-4 gap-2">
        {weather.forecast.map((day, index) => (
          <div key={index} className="text-center p-2 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-600 mb-1">{day.day}</div>
            <div className="flex justify-center mb-1">{getWeatherIcon(day.condition)}</div>
            <div className="text-sm font-medium">{day.temp}°</div>
            <div className="text-xs text-blue-600">{day.rain}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}