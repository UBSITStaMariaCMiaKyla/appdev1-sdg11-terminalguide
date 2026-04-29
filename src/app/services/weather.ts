import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { WeatherResponse, WeatherDisplay } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);

  // Open-Meteo — free, no API key required
  // Baguio City coordinates: 16.4023°N, 120.5960°E
  private readonly URL =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=16.4023&longitude=120.5960' +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
    '&wind_speed_unit=kmh&timezone=Asia%2FManila';

  private weather$: Observable<WeatherDisplay> = this.http
    .get<WeatherResponse>(this.URL)
    .pipe(
      map(res => this.mapToDisplay(res)),
      shareReplay(1)
    );

  getWeather(): Observable<WeatherDisplay> {
    return this.weather$;
  }

  private mapToDisplay(res: WeatherResponse): WeatherDisplay {
    const code = res.current.weather_code;
    return {
      temp: Math.round(res.current.temperature_2m),
      humidity: res.current.relative_humidity_2m,
      windSpeed: Math.round(res.current.wind_speed_10m),
      condition: this.getCondition(code),
      icon: this.getIcon(code),
    };
  }

  // WMO weather code mapping
  private getCondition(code: number): string {
    if (code === 0)              return 'Clear Sky';
    if (code === 1)              return 'Mainly Clear';
    if (code === 2)              return 'Partly Cloudy';
    if (code === 3)              return 'Overcast';
    if (code <= 49)              return 'Foggy';
    if (code <= 59)              return 'Drizzle';
    if (code <= 69)              return 'Rain';
    if (code <= 79)              return 'Snow';
    if (code === 80)             return 'Light Showers';
    if (code === 81)             return 'Showers';
    if (code === 82)             return 'Heavy Showers';
    if (code >= 95 && code < 99) return 'Thunderstorm';
    if (code >= 99)              return 'Heavy Thunderstorm';
    return 'Unknown';
  }

  private getIcon(code: number): string {
    if (code === 0)              return '☀️';
    if (code === 1)              return '🌤️';
    if (code === 2)              return '⛅';
    if (code === 3)              return '☁️';
    if (code <= 49)              return '🌫️';
    if (code <= 59)              return '🌦️';
    if (code <= 69)              return '🌧️';
    if (code <= 79)              return '❄️';
    if (code <= 82)              return '🌧️';
    if (code >= 95)              return '⛈️';
    return '🌡️';
  }
}