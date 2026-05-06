import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
  hoveredStar = signal(0);
  selectedStar = signal(0);
  name = signal('');
  email = signal('');
  category = signal('');
  message = signal('');
  submitted = signal(false);
  submitting = signal(false);

  hasUnsavedChanges(): boolean {
    return this.message().trim().length > 0 || this.selectedStar() > 0;
  }

  ratingLabel = computed(() => {
    const active = this.hoveredStar() || this.selectedStar();
    const labels: Record<number, string> = {
      1: 'Needs work',
      2: "It's okay",
      3: 'Pretty good',
      4: 'Really helpful',
      5: 'Absolutely love it!',
    };
    return labels[active] ?? 'Rate your experience';
  });

  hoverStar(n: number): void { this.hoveredStar.set(n); }
  leaveStar(): void { this.hoveredStar.set(0); }
  selectStar(n: number): void { this.selectedStar.set(n); }
  isActive(n: number): boolean { return n <= (this.hoveredStar() || this.selectedStar()); }

  onInput(field: 'name' | 'email' | 'category' | 'message', event: Event): void {
    const val = (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    if (field === 'name') this.name.set(val);
    else if (field === 'email') this.email.set(val);
    else if (field === 'category') this.category.set(val);
    else if (field === 'message') this.message.set(val);
  }

  onSubmit(): void {
    if (!this.selectedStar() || !this.message().trim()) return;
    this.submitting.set(true);
    setTimeout(() => { this.submitting.set(false); this.submitted.set(true); }, 1200);
  }

  resetForm(): void {
    this.hoveredStar.set(0);
    this.selectedStar.set(0);
    this.name.set('');
    this.email.set('');
    this.category.set('');
    this.message.set('');
    this.submitted.set(false);
  }
}