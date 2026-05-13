import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather';
import { WeatherResponse } from '../models/weather.model';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const mockResponse: WeatherResponse = {
    current: {
      temperature_2m: 18,
      relative_humidity_2m: 91,
      wind_speed_10m: 3,
      weather_code: 0,
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and map weather data correctly', () => {
    service.getWeather().subscribe(display => {
      expect(display.temp).toBe(18);
      expect(display.humidity).toBe(91);
      expect(display.windSpeed).toBe(3);
      expect(display.condition).toBe('Clear Sky');
      expect(display.icon).toBe('clear');
    });

    const req = httpMock.expectOne(r => r.url.includes('open-meteo.com'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return Partly Cloudy for weather code 1', () => {
    service.getWeather().subscribe(display => {
      expect(display.condition).toBe('Mainly Clear');
    });

    const req = httpMock.expectOne(r => r.url.includes('open-meteo.com'));
    req.flush({ current: { ...mockResponse.current, weather_code: 1 } });
  });

  it('should return Thunderstorm for weather code 95', () => {
    service.getWeather().subscribe(display => {
      expect(display.condition).toBe('Thunderstorm');
      expect(display.icon).toBe('thunderstorm');
    });

    const req = httpMock.expectOne(r => r.url.includes('open-meteo.com'));
    req.flush({ current: { ...mockResponse.current, weather_code: 95 } });
  });
});