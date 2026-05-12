import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { WeatherService } from '../../services/weather';
import { Observable } from 'rxjs';
import { WeatherDisplay } from '../../models/weather.model';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.css',
})
export class WeatherWidget implements OnInit {
  private weatherService = inject(WeatherService);
  weather$!: Observable<WeatherDisplay>;

  ngOnInit(): void {
    this.weather$ = this.weatherService.getWeather();
  }
}