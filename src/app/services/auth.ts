import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly STORAGE_KEY = 'bjg_user';

  login(email: string): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ email }));
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getUserEmail(): string {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return '';
    try {
      return JSON.parse(data).email ?? '';
    } catch {
      return '';
    }
  }
}