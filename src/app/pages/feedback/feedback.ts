import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
  hoveredStar = 0;
  selectedStar = 0;
  name = '';
  email = '';
  category = '';
  message = '';
  submitted = false;
  submitting = false;

  get ratingLabel(): string {
    const active = this.hoveredStar || this.selectedStar;
    const labels: Record<number, string> = {
      1: 'Needs work',
      2: 'It\'s okay',
      3: 'Pretty good',
      4: 'Really helpful',
      5: 'Absolutely love it!',
    };
    return labels[active] ?? 'Rate your experience';
  }

  hoverStar(n: number): void {
    this.hoveredStar = n;
  }

  leaveStar(): void {
    this.hoveredStar = 0;
  }

  selectStar(n: number): void {
    this.selectedStar = n;
  }

  isActive(n: number): boolean {
    return n <= (this.hoveredStar || this.selectedStar);
  }

  onSubmit(): void {
    if (!this.selectedStar || !this.message.trim()) return;
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
    }, 1200);
  }

  resetForm(): void {
    this.hoveredStar = 0;
    this.selectedStar = 0;
    this.name = '';
    this.email = '';
    this.category = '';
    this.message = '';
    this.submitted = false;
  }
}