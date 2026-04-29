export interface WeatherResponse {
    current: {
      temperature_2m: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
      weather_code: number;
    };
  }
  
  export interface WeatherDisplay {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
  }